import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, GetPromptRequestSchema, ListPromptsRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { mcpResources } from "./resources";
import { mcpTools } from "./tools";
import { mcpPrompts } from "./prompts";
import { logger } from "../logger";

export class McpTransport {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "url-to-markdown-converter",
        version: "1.0.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // Resource handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const resources = await mcpResources.listResources();
      return { resources };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      return await mcpResources.readResource(request.params.uri);
    });

    // Tool handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = await mcpTools.listTools();
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      return await mcpTools.callTool(request);
    });

    // Prompt handlers
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      const prompts = await mcpPrompts.listPrompts();
      return { prompts };
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      return await mcpPrompts.getPrompt(request);
    });

    // Error handler
    this.server.onerror = (error) => {
      logger.error("MCP Server error", { error: error.message, stack: error.stack });
    };
  }

  async start() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      await logger.info("MCP Server started with stdio transport");
      
      // Handle process termination gracefully
      process.on('SIGINT', async () => {
        await logger.info("MCP Server shutting down...");
        await this.server.close();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await logger.info("MCP Server shutting down...");
        await this.server.close();
        process.exit(0);
      });

    } catch (error) {
      await logger.error("Failed to start MCP Server", { error });
      throw error;
    }
  }

  getServer() {
    return this.server;
  }
}

export const mcpTransport = new McpTransport();
