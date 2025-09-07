## MCP Integration Examples

This server implements the Model Context Protocol (MCP) for seamless integration with AI clients like Claude Desktop, VS Code extensions, and other MCP-compatible tools.

### Quick Start with AI Clients

1. **Claude Desktop**: Add to your `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "url-converter": {
         "command": "tsx",
         "args": ["server/index.ts"],
         "cwd": "/path/to/this/project"
       }
     }
   }
   ```

2. **Usage Examples**:
   ```
   "Convert this article to markdown: https://example.com/article"
   "Show me server statistics and recent conversions"
   "Create a summary of conversion abc123"
   ```

For comprehensive usage examples, see [MCP_USAGE_EXAMPLES.md](./MCP_USAGE_EXAMPLES.md).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)