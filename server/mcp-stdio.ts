#!/usr/bin/env node

import { McpTransport } from "./services/mcp/transport.js";
import { logger } from "./services/logger.js";

async function main() {
  try {
    await logger.info("Starting MCP Server with stdio transport");
    
    const transport = new McpTransport();
    await transport.connect();
    
    await logger.success("MCP Server started successfully with stdio transport");
    
    // Keep the process running
    process.on('SIGINT', async () => {
      await logger.info("Shutting down MCP Server");
      process.exit(0);
    });
    
  } catch (error) {
    await logger.error("Failed to start MCP Server", { error });
    process.exit(1);
  }
}

main();
