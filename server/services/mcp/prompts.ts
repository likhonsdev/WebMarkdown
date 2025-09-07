import { Prompt, GetPromptRequest } from "@modelcontextprotocol/sdk/types.js";
import { storage } from "../../storage";
import { logger } from "../logger";

export class McpPrompts {
  async listPrompts(): Promise<Prompt[]> {
    return [
      {
        name: "summarize_conversion",
        description: "Create a summary of a URL conversion result",
        arguments: [
          {
            name: "conversionId",
            description: "The ID of the conversion to summarize",
            required: true,
          },
        ],
      },
      {
        name: "analyze_server_performance",
        description: "Analyze server performance metrics and provide insights",
      },
      {
        name: "create_conversion_report",
        description: "Generate a detailed report of recent conversions",
        arguments: [
          {
            name: "timeframe",
            description: "Timeframe for the report (e.g., 'last_hour', 'last_day', 'last_week')",
            required: false,
          },
        ],
      },
    ];
  }

  async getPrompt(request: GetPromptRequest): Promise<any> {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "summarize_conversion":
          return await this.getSummarizeConversionPrompt(args);
        
        case "analyze_server_performance":
          return await this.getAnalyzeServerPerformancePrompt();
        
        case "create_conversion_report":
          return await this.getCreateConversionReportPrompt(args);
        
        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    } catch (error) {
      await logger.error(`MCP prompt request failed: ${name}`, { error, args });
      throw error;
    }
  }

  private async getSummarizeConversionPrompt(args: any) {
    const { conversionId } = args || {};

    if (!conversionId) {
      throw new Error('Conversion ID is required');
    }

    const conversion = await storage.getConversion(conversionId);
    if (!conversion) {
      throw new Error(`Conversion ${conversionId} not found`);
    }

    if (conversion.status !== 'completed' || !conversion.markdown) {
      throw new Error(`Conversion ${conversionId} is not completed or has no markdown content`);
    }

    return {
      description: `Summarize the conversion of ${conversion.url}`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please provide a concise summary of the following markdown content that was converted from the URL: ${conversion.url}

Title: ${conversion.title}

Content:
${conversion.markdown}

Please include:
1. A brief description of what the content is about
2. Key topics or themes covered
3. Notable features or highlights
4. Estimated reading time
5. Content quality assessment

Keep the summary informative but concise (2-3 paragraphs maximum).`,
          },
        },
      ],
    };
  }

  private async getAnalyzeServerPerformancePrompt() {
    const stats = await storage.getServerStats();
    const recentLogs = await storage.getRecentActivityLogs(50);
    const activeConnections = await storage.getActiveMcpConnections();

    return {
      description: "Analyze current server performance and provide insights",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please analyze the following server performance data and provide insights and recommendations:

Server Statistics:
${JSON.stringify(stats, null, 2)}

Active MCP Connections: ${activeConnections.length}

Recent Activity Summary:
- Total log entries: ${recentLogs.length}
- Success entries: ${recentLogs.filter(log => log.type === 'success').length}
- Error entries: ${recentLogs.filter(log => log.type === 'error').length}
- Warning entries: ${recentLogs.filter(log => log.type === 'warning').length}

Please provide:
1. Overall performance assessment
2. Identification of any concerning trends
3. Resource utilization analysis
4. Recommendations for optimization
5. Potential areas of improvement
6. Alert conditions that may need attention

Format your response as a structured analysis with clear sections.`,
          },
        },
      ],
    };
  }

  private async getCreateConversionReportPrompt(args: any) {
    const { timeframe = 'last_day' } = args || {};
    
    const conversions = await storage.getRecentConversions(100);
    const stats = await storage.getServerStats();

    // Filter conversions based on timeframe
    const now = new Date();
    let cutoffTime: Date;
    
    switch (timeframe) {
      case 'last_hour':
        cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'last_day':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'last_week':
        cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const filteredConversions = conversions.filter(c => 
      c.createdAt && new Date(c.createdAt) >= cutoffTime
    );

    return {
      description: `Generate a conversion report for ${timeframe}`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please create a comprehensive conversion report based on the following data for the timeframe: ${timeframe}

Conversion Data:
${JSON.stringify(filteredConversions.map(c => ({
  id: c.id,
  url: c.url,
  status: c.status,
  title: c.title,
  createdAt: c.createdAt,
  completedAt: c.completedAt,
  includeImages: c.includeImages,
  cleanHtml: c.cleanHtml,
  errorMessage: c.errorMessage,
})), null, 2)}

Server Statistics:
${JSON.stringify(stats, null, 2)}

Please provide:
1. Executive summary of conversion activity
2. Success vs failure rate analysis
3. Most popular domains/websites converted
4. Average conversion time analysis
5. Configuration preferences (images, clean HTML usage)
6. Error analysis and common failure patterns
7. Performance trends and recommendations
8. Data-driven insights for service improvement

Format as a professional report with clear sections and actionable insights.`,
          },
        },
      ],
    };
  }
}

export const mcpPrompts = new McpPrompts();
