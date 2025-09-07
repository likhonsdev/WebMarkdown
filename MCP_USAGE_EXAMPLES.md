
# MCP Server Usage Examples with AI Clients

This document provides practical examples of how to use the URL to Markdown Converter MCP server with various AI clients like Claude Desktop, VS Code extensions, and other MCP-compatible tools.

## Table of Contents
- [Server Setup](#server-setup)
- [Configuration Examples](#configuration-examples)
- [Tool Usage Examples](#tool-usage-examples)
- [Resource Access Examples](#resource-access-examples)
- [Prompt Usage Examples](#prompt-usage-examples)
- [Integration with Popular AI Clients](#integration-with-popular-ai-clients)

## Server Setup

### Starting the MCP Server

The server can be started in two modes:

1. **Stdio Transport** (for most AI clients):
```bash
npm run mcp:stdio
```

2. **WebSocket Transport** (for web-based integrations):
```bash
npm run dev
```

## Configuration Examples

### Claude Desktop Configuration

Add this to your Claude Desktop configuration file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "url-converter": {
      "command": "node",
      "args": [
        "/path/to/your/project/server/index.ts"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### VS Code with MCP Extension

```json
{
  "mcp.servers": [
    {
      "name": "url-converter",
      "transport": "stdio",
      "command": "tsx",
      "args": ["server/index.ts"],
      "cwd": "/path/to/your/project"
    }
  ]
}
```

## Tool Usage Examples

### Converting a URL to Markdown

**Example 1: Basic Conversion**
```
Please convert this URL to markdown: https://example.com/article

AI will use: convert_url_to_markdown tool
Parameters: {"url": "https://example.com/article"}
```

**Example 2: Conversion with Options**
```
Convert this blog post to markdown, but exclude images and use clean HTML extraction: https://blog.example.com/post

AI will use: convert_url_to_markdown tool
Parameters: {
  "url": "https://blog.example.com/post",
  "includeImages": false,
  "cleanHtml": true
}
```

### Checking Conversion Status

```
Check the status of conversion ID: abc123

AI will use: get_conversion_status tool
Parameters: {"conversionId": "abc123"}
```

### Listing Recent Conversions

```
Show me the last 5 URL conversions

AI will use: list_recent_conversions tool
Parameters: {"limit": 5}
```

## Resource Access Examples

### Accessing Converted Markdown

```
Show me the markdown content for conversion abc123

AI will access: conversion://abc123 resource
Returns: The full markdown content
```

### Getting Server Statistics

```
What's the current server performance?

AI will access: stats://server resource
Returns: JSON with server metrics, conversion counts, etc.
```

### Viewing Activity Logs

```
Show me recent server activity

AI will access: logs://activity resource
Returns: Recent activity logs with timestamps and status
```

## Prompt Usage Examples

### Summarizing a Conversion

```
Create a summary of the conversion abc123

AI will use: summarize_conversion prompt
Parameters: {"conversionId": "abc123"}

This generates a comprehensive summary including:
- Content description
- Key topics covered
- Reading time estimate
- Quality assessment
```

### Analyzing Server Performance

```
Analyze the server performance and give me insights

AI will use: analyze_server_performance prompt
Returns: Detailed performance analysis with recommendations
```

### Creating Conversion Reports

```
Generate a report of conversions from the last week

AI will use: create_conversion_report prompt
Parameters: {"timeframe": "last_week"}
```

## Integration with Popular AI Clients

### Claude Desktop Example Workflow

1. **Setup**: Configure Claude Desktop with the MCP server
2. **Usage**: 
   ```
   User: "Convert this research paper to markdown: https://arxiv.org/abs/2301.00001 and then summarize the key findings"
   
   Claude: 
   1. Uses convert_url_to_markdown tool
   2. Uses summarize_conversion prompt 
   3. Provides both the markdown and summary
   ```

### VS Code Extension Example

```typescript
// Example integration in VS Code extension
import { MCPClient } from '@modelcontextprotocol/sdk/client';

const client = new MCPClient();
await client.connect();

// Convert URL
const result = await client.callTool('convert_url_to_markdown', {
  url: 'https://example.com/article',
  includeImages: true,
  cleanHtml: false
});

console.log(result.content[0].text); // Markdown content
```

### Cline (VS Code) Configuration

Add to your Cline settings:

```json
{
  "mcp": {
    "servers": [
      {
        "name": "url-converter",
        "command": "tsx",
        "args": ["server/index.ts"],
        "cwd": "${workspaceFolder}"
      }
    ]
  }
}
```

## Advanced Usage Patterns

### Batch Processing URLs

```
Convert these URLs to markdown and create a summary report:
1. https://example.com/article1
2. https://example.com/article2  
3. https://example.com/article3

AI will:
1. Use convert_url_to_markdown for each URL
2. Use create_conversion_report prompt
3. Provide consolidated analysis
```

### Content Analysis Pipeline

```
Convert this URL and analyze the content structure: https://docs.example.com

AI will:
1. Convert using convert_url_to_markdown
2. Access the conversion resource
3. Use summarize_conversion prompt
4. Provide structured analysis
```

### Monitoring and Maintenance

```
Check server health and recent activity

AI will:
1. Access stats://server resource
2. Access logs://activity resource  
3. Use analyze_server_performance prompt
4. Provide health report with recommendations
```

## Error Handling Examples

### Common Error Scenarios

1. **Invalid URL**:
   ```
   Error: Only HTTP and HTTPS URLs are supported
   ```

2. **Network Timeout**:
   ```
   Error: Conversion failed: Request timeout
   ```

3. **Content Extraction Failed**:
   ```
   Error: Failed to extract readable content from the page
   ```

### Recovery Strategies

```
If conversion fails, check the error and try with different options:

User: "The conversion failed, try again with clean HTML enabled"
AI: Uses convert_url_to_markdown with cleanHtml: true
```

## Performance Optimization

### Best Practices

1. **Use Clean HTML** for content-heavy pages
2. **Disable Images** for faster processing when images aren't needed
3. **Monitor server stats** regularly
4. **Check conversion status** for long-running operations

### Example Monitoring Setup

```
Create a monitoring dashboard by regularly calling:
- stats://server resource
- logs://activity resource  
- analyze_server_performance prompt

This provides comprehensive server health monitoring.
```

## Troubleshooting

### Common Issues

1. **MCP Server Not Starting**: Check Node.js version and dependencies
2. **Connection Issues**: Verify transport configuration
3. **Tool Calls Failing**: Check server logs and network connectivity

### Debug Commands

```bash
# Check server status
curl http://localhost:5000/api/status

# View server logs
tail -f server.log

# Test MCP connection
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | tsx server/index.ts
```

This MCP server provides a powerful way to integrate URL-to-markdown conversion capabilities directly into your AI workflows, making content processing and analysis seamless and efficient.
