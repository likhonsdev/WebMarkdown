import { Resource } from "@modelcontextprotocol/sdk/types.js";
import { storage } from "../../storage";
import { logger } from "../logger";

export class McpResources {
  async listResources(): Promise<Resource[]> {
    try {
      const conversions = await storage.getRecentConversions(50);
      const resources: Resource[] = [];

      // Add conversion resources
      for (const conversion of conversions) {
        if (conversion.status === 'completed' && conversion.markdown) {
          resources.push({
            uri: `conversion://${conversion.id}`,
            name: `Conversion: ${conversion.title || conversion.url}`,
            description: `Markdown conversion of ${conversion.url}`,
            mimeType: "text/markdown",
          });
        }
      }

      // Add server stats resource
      resources.push({
        uri: "stats://server",
        name: "Server Statistics",
        description: "Current server performance and usage statistics",
        mimeType: "application/json",
      });

      // Add activity logs resource
      resources.push({
        uri: "logs://activity",
        name: "Activity Logs",
        description: "Recent server activity and conversion logs",
        mimeType: "application/json",
      });

      return resources;
    } catch (error) {
      await logger.error("Failed to list MCP resources", { error });
      return [];
    }
  }

  async readResource(uri: string): Promise<any> {
    try {
      if (uri.startsWith("conversion://")) {
        const conversionId = uri.replace("conversion://", "");
        const conversion = await storage.getConversion(conversionId);
        
        if (!conversion || conversion.status !== 'completed' || !conversion.markdown) {
          throw new Error(`Conversion ${conversionId} not found or not completed`);
        }

        return {
          contents: [{
            uri,
            mimeType: "text/markdown",
            text: conversion.markdown,
          }],
        };
      }

      if (uri === "stats://server") {
        const stats = await storage.getServerStats();
        return {
          contents: [{
            uri,
            mimeType: "application/json",
            text: JSON.stringify(stats, null, 2),
          }],
        };
      }

      if (uri === "logs://activity") {
        const logs = await storage.getRecentActivityLogs(100);
        return {
          contents: [{
            uri,
            mimeType: "application/json",
            text: JSON.stringify(logs, null, 2),
          }],
        };
      }

      throw new Error(`Unknown resource URI: ${uri}`);
    } catch (error) {
      await logger.error(`Failed to read MCP resource: ${uri}`, { error });
      throw error;
    }
  }
}

export const mcpResources = new McpResources();
