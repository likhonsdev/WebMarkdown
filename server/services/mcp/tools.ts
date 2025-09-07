import { Tool, CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { storage } from "../../storage";
import { urlConverter } from "../url-converter";
import { logger } from "../logger";

export class McpTools {
  async listTools(): Promise<Tool[]> {
    return [
      {
        name: "convert_url_to_markdown",
        description: "Convert a web page URL to markdown format",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              format: "uri",
              description: "The URL of the web page to convert",
            },
            includeImages: {
              type: "boolean",
              description: "Whether to include images in the markdown",
              default: true,
            },
            cleanHtml: {
              type: "boolean", 
              description: "Whether to use Readability to clean the HTML before conversion",
              default: false,
            },
          },
          required: ["url"],
        },
      },
      {
        name: "get_conversion_status",
        description: "Get the status of a conversion by ID",
        inputSchema: {
          type: "object",
          properties: {
            conversionId: {
              type: "string",
              description: "The ID of the conversion to check",
            },
          },
          required: ["conversionId"],
        },
      },
      {
        name: "list_recent_conversions",
        description: "List recent URL conversions",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Maximum number of conversions to return",
              default: 10,
              minimum: 1,
              maximum: 50,
            },
          },
        },
      },
    ];
  }

  async callTool(request: CallToolRequest): Promise<any> {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "convert_url_to_markdown":
          return await this.convertUrlToMarkdown(args);
        
        case "get_conversion_status":
          return await this.getConversionStatus(args);
        
        case "list_recent_conversions":
          return await this.listRecentConversions(args);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      await logger.error(`MCP tool call failed: ${name}`, { error, args });
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        }],
        isError: true,
      };
    }
  }

  private async convertUrlToMarkdown(args: any) {
    const { url, includeImages = true, cleanHtml = false } = args;

    if (!url || typeof url !== 'string') {
      throw new Error('URL is required and must be a string');
    }

    // Create conversion record
    const conversion = await storage.createConversion({
      url,
      includeImages,
      cleanHtml,
    });

    try {
      // Update status to processing
      await storage.updateConversion(conversion.id, {
        status: 'processing',
      });

      // Perform conversion
      const result = await urlConverter.convertUrl(url, {
        includeImages,
        cleanHtml,
      });

      // Update with results
      await storage.updateConversion(conversion.id, {
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

      return {
        content: [{
          type: "text",
          text: `Successfully converted URL: ${url}\n\nTitle: ${result.title}\n\n${result.markdown}`,
        }],
      };

    } catch (error) {
      // Update with error
      await storage.updateConversion(conversion.id, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      });

      throw error;
    }
  }

  private async getConversionStatus(args: any) {
    const { conversionId } = args;

    if (!conversionId || typeof conversionId !== 'string') {
      throw new Error('Conversion ID is required and must be a string');
    }

    const conversion = await storage.getConversion(conversionId);
    if (!conversion) {
      throw new Error(`Conversion ${conversionId} not found`);
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          id: conversion.id,
          url: conversion.url,
          status: conversion.status,
          title: conversion.title,
          createdAt: conversion.createdAt,
          completedAt: conversion.completedAt,
          errorMessage: conversion.errorMessage,
        }, null, 2),
      }],
    };
  }

  private async listRecentConversions(args: any) {
    const { limit = 10 } = args;

    const conversions = await storage.getRecentConversions(limit);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(conversions.map(c => ({
          id: c.id,
          url: c.url,
          status: c.status,
          title: c.title,
          createdAt: c.createdAt,
          completedAt: c.completedAt,
        })), null, 2),
      }],
    };
  }
}

export const mcpTools = new McpTools();
