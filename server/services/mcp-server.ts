import { mcpTransport } from "./mcp/transport";
import { logger } from "./logger";
import { storage } from "../storage";

export class McpServerService {
  private isRunning = false;

  async start() {
    if (this.isRunning) {
      await logger.warning("MCP Server is already running");
      return;
    }

    try {
      await mcpTransport.start();
      this.isRunning = true;
      
      await logger.success("MCP Server service started successfully");
      
      // Update server stats
      await storage.updateServerStats({
        activeConnections: 1,
      });

    } catch (error) {
      await logger.error("Failed to start MCP Server service", { error });
      throw error;
    }
  }

  async stop() {
    if (!this.isRunning) {
      await logger.warning("MCP Server is not running");
      return;
    }

    try {
      const server = mcpTransport.getServer();
      await server.close();
      this.isRunning = false;
      
      await logger.info("MCP Server service stopped");
      
      // Update server stats
      await storage.updateServerStats({
        activeConnections: 0,
      });

    } catch (error) {
      await logger.error("Failed to stop MCP Server service", { error });
      throw error;
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }

  getStatus() {
    return {
      protocolStatus: this.isRunning ? 'active' : 'inactive',
      websocketStatus: 'connected', // This would be managed by WebSocket transport
      httpStatus: 'available', // This would be managed by HTTP transport
      rateLimitingStatus: 'active',
    };
  }
}

export const mcpServerService = new McpServerService();
