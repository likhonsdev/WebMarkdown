import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { logger } from "./services/logger";
import { rateLimiter } from "./services/rate-limiter";
import { urlConverter } from "./services/url-converter";
import { mcpServerService } from "./services/mcp-server";
import { insertConversionSchema, type ConversionRequest, type ApiResponse } from "@shared/schema";
import { z } from "zod";

// Rate limiting middleware
const rateLimitMiddleware = (req: Request, res: Response, next: Function) => {
  const clientId = req.ip || 'unknown';
  
  if (!rateLimiter.isAllowed(clientId)) {
    const resetTime = rateLimiter.getResetTime(clientId);
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Try again later.',
      resetTime,
    });
    return;
  }

  const remaining = rateLimiter.getRemainingRequests(clientId);
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimiter.getResetTime(clientId).toString());
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', async (ws: WebSocket) => {
    clients.add(ws);
    
    await logger.info('New WebSocket connection established');
    
    // Send initial status
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'connection_established',
        data: { message: 'Connected to MCP Server' },
      }));
    }

    ws.on('close', async () => {
      clients.delete(ws);
      await logger.info('WebSocket connection closed');
    });

    ws.on('error', async (error) => {
      await logger.error('WebSocket error', { error: error.message });
      clients.delete(ws);
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (type: string, data: any) => {
    const message = JSON.stringify({ type, data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Start MCP Server
  try {
    await mcpServerService.start();
  } catch (error) {
    await logger.error('Failed to start MCP Server on initialization', { error });
  }

  // Routes
  
  // Health check
  app.get('/api/health', async (req, res) => {
    try {
      const stats = await storage.getServerStats();
      res.json({
        success: true,
        data: {
          status: 'healthy',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          stats,
        },
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Health check failed',
      } as ApiResponse);
    }
  });

  // Get server status
  app.get('/api/status', async (req, res) => {
    try {
      const status = mcpServerService.getStatus();
      res.json({
        success: true,
        data: status,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get server status',
      } as ApiResponse);
    }
  });

  // Get server stats
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getServerStats();
      
      // Update real-time stats
      const activeConnections = clients.size;
      if (stats) {
        await storage.updateServerStats({ activeConnections });
      }
      
      const updatedStats = await storage.getServerStats();
      
      res.json({
        success: true,
        data: updatedStats,
      } as ApiResponse);
    } catch (error) {
      await logger.error('Failed to get server stats', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to get server stats',
      } as ApiResponse);
    }
  });

  // Convert URL to markdown
  app.post('/api/convert', rateLimitMiddleware, async (req, res) => {
    try {
      const validatedData = insertConversionSchema.parse(req.body);
      const { url, includeImages = true, cleanHtml = false } = validatedData;

      await logger.info(`Conversion request received for: ${url}`, { 
        includeImages, 
        cleanHtml,
        clientIp: req.ip 
      });

      // Create conversion record
      const conversion = await storage.createConversion({
        url,
        includeImages,
        cleanHtml,
      });

      // Broadcast conversion started
      broadcast('conversion_started', { 
        id: conversion.id, 
        url: conversion.url 
      });

      try {
        // Update status to processing
        await storage.updateConversion(conversion.id, {
          status: 'processing',
        });

        // Perform conversion
        const result = await urlConverter.convertUrl(url, {
          includeImages: includeImages ?? true,
          cleanHtml: cleanHtml ?? false,
        });

        // Update with results
        const completedConversion = await storage.updateConversion(conversion.id, {
          status: 'completed',
          markdown: result.markdown,
          title: result.title,
          completedAt: new Date(),
        });

        // Update server stats
        const stats = await storage.getServerStats();
        if (stats) {
          await storage.updateServerStats({
            totalConversions: (stats.totalConversions || 0) + 1,
          });
        }

        // Broadcast successful conversion
        broadcast('conversion_completed', {
          id: conversion.id,
          url: conversion.url,
          title: result.title,
        });

        broadcast('stats_update', {});

        res.json({
          success: true,
          data: {
            id: conversion.id,
            url: result.url,
            title: result.title,
            markdown: result.markdown,
            createdAt: conversion.createdAt,
            completedAt: completedConversion?.completedAt,
          },
        } as ApiResponse);

      } catch (conversionError) {
        const errorMessage = conversionError instanceof Error 
          ? conversionError.message 
          : 'Unknown conversion error';

        // Update with error
        await storage.updateConversion(conversion.id, {
          status: 'failed',
          errorMessage,
          completedAt: new Date(),
        });

        // Broadcast failed conversion
        broadcast('conversion_failed', {
          id: conversion.id,
          url: conversion.url,
          error: errorMessage,
        });

        await logger.error(`Conversion failed for: ${url}`, { 
          error: errorMessage,
          conversionId: conversion.id 
        });

        res.status(400).json({
          success: false,
          error: errorMessage,
        } as ApiResponse);
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        } as ApiResponse);
      } else {
        await logger.error('Conversion endpoint error', { error });
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        } as ApiResponse);
      }
    }
  });

  // Get conversion by ID
  app.get('/api/conversions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const conversion = await storage.getConversion(id);
      
      if (!conversion) {
        res.status(404).json({
          success: false,
          error: 'Conversion not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: conversion,
      } as ApiResponse);
    } catch (error) {
      await logger.error('Failed to get conversion', { error, id: req.params.id });
      res.status(500).json({
        success: false,
        error: 'Failed to get conversion',
      } as ApiResponse);
    }
  });

  // Get recent conversions
  app.get('/api/conversions', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const conversions = await storage.getRecentConversions(Math.min(limit, 50));
      
      res.json({
        success: true,
        data: conversions,
      } as ApiResponse);
    } catch (error) {
      await logger.error('Failed to get conversions', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to get conversions',
      } as ApiResponse);
    }
  });

  // Get activity logs
  app.get('/api/logs', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getRecentActivityLogs(Math.min(limit, 100));
      
      res.json({
        success: true,
        data: logs,
      } as ApiResponse);
    } catch (error) {
      await logger.error('Failed to get activity logs', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to get activity logs',
      } as ApiResponse);
    }
  });

  // MCP server control endpoints
  app.post('/api/mcp/start', async (req, res) => {
    try {
      await mcpServerService.start();
      broadcast('status_update', {});
      
      res.json({
        success: true,
        data: { message: 'MCP Server started' },
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to start MCP Server',
      } as ApiResponse);
    }
  });

  app.post('/api/mcp/stop', async (req, res) => {
    try {
      await mcpServerService.stop();
      broadcast('status_update', {});
      
      res.json({
        success: true,
        data: { message: 'MCP Server stopped' },
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to stop MCP Server',
      } as ApiResponse);
    }
  });

  // Periodic stats update
  setInterval(async () => {
    try {
      const stats = await storage.getServerStats();
      if (stats) {
        // Update CPU and memory usage (simplified)
        const memUsage = process.memoryUsage();
        await storage.updateServerStats({
          activeConnections: clients.size,
          memoryUsage: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
          cpuUsage: Math.floor(Math.random() * 20) + 5, // Simulated CPU usage
        });
        
        broadcast('stats_update', {});
      }
    } catch (error) {
      await logger.error('Failed to update periodic stats', { error });
    }
  }, 30000); // Every 30 seconds

  return httpServer;
}
