
# WebMarkdown - URL to Markdown Converter

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-%3E%3D18.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.6.3-blue.svg)

A modern, full-stack web application that converts web pages to clean Markdown format using Mozilla's Readability library. Built with React, Express.js, and implements the Model Context Protocol (MCP) for seamless AI integration.

## ✨ Features

- **🔗 URL to Markdown Conversion**: Extract clean, readable content from any web page
- **🎨 Modern UI**: Built with React 18, shadcn/ui, and Tailwind CSS
- **🤖 AI Integration**: MCP (Model Context Protocol) support for Claude Desktop and other AI clients
- **📊 Real-time Dashboard**: Live statistics, activity logs, and server monitoring
- **🌙 Dark/Light Theme**: System-aware theme switching
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Updates**: WebSocket integration for live data updates
- **🛡️ Rate Limiting**: Built-in protection against abuse
- **📋 Copy to Clipboard**: One-click copying of converted markdown
- **🔧 Configurable Options**: Include/exclude images, clean HTML extraction

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (optional - uses in-memory storage by default)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/likhonsdev/WebMarkdown.git
   cd WebMarkdown
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

### 🌐 Live Demo

Try the live demo on Replit: [WebMarkdown Demo](https://replit.com/@likhonsdev/WebMarkdown)

**Example URLs to test:**
- `https://github.com/microsoft/TypeScript` - GitHub repository
- `https://docs.github.com/en/get-started` - Documentation page
- `https://blog.github.com/2024-01-01-example-post` - Blog article

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript and Vite
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for styling
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **WebSocket** integration for real-time updates

### Backend
- **Express.js** with TypeScript
- **MCP SDK** for AI client integration
- **PostgreSQL** with Drizzle ORM
- **Mozilla Readability** for content extraction
- **Turndown** for HTML to Markdown conversion
- **Rate limiting** and security middleware

## 🤖 MCP Integration

This application implements the Model Context Protocol, making it compatible with AI clients like Claude Desktop.

### Quick Setup with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "webmarkdown": {
      "command": "npx",
      "args": ["tsx", "server/mcp-stdio.ts"],
      "cwd": "/path/to/WebMarkdown"
    }
  }
}
```

### Available Tools

- `convert_url_to_markdown` - Convert any URL to clean markdown
- `get_conversion_status` - Check the status of a conversion
- `list_recent_conversions` - Get recent conversion history

### Example AI Commands

```
"Convert this article to markdown: https://example.com/article"
"Show me server statistics and recent conversions"
"Get the conversion status for ID abc123"
```

For detailed examples, see [MCP_USAGE_EXAMPLES.md](./MCP_USAGE_EXAMPLES.md).

## 🚀 Example Usage

### Web Interface

1. **Simple Conversion**:
   - Enter URL: `https://github.com/microsoft/TypeScript`
   - Click "Convert to Markdown"
   - Copy the generated markdown

2. **Advanced Options**:
   - Enable "Clean HTML" for better content extraction
   - Disable "Include Images" for text-only conversion

### API Usage

```bash
# Convert a URL to markdown
curl -X POST http://localhost:5000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/article", "includeImages": true, "cleanHtml": false}'

# Get server statistics
curl http://localhost:5000/api/stats

# Check server status
curl http://localhost:5000/api/status
```

### AI Integration Examples

```
"Convert this documentation to markdown: https://docs.example.com/guide"
"Get server statistics and recent conversions"
"Show me the conversion status for ID abc123"
```

## 📡 API Endpoints

### Core Endpoints

- `POST /api/convert` - Convert URL to markdown
- `GET /api/conversions` - List recent conversions  
- `GET /api/conversions/:id` - Get specific conversion
- `GET /api/logs` - Get activity logs
- `GET /api/stats` - Get server statistics
- `GET /api/status` - Get server status

### MCP Control

- `POST /api/mcp/start` - Start MCP server
- `POST /api/mcp/stop` - Stop MCP server

## 🛠️ Configuration

### Environment Variables

Create a `.env` file or set environment variables:

```bash
PORT=5000                    # Server port (default: 5000)
DATABASE_URL=postgresql://   # PostgreSQL connection string (optional)
NODE_ENV=development         # Environment mode
```

### Database Setup

The application works with or without a database:

- **With PostgreSQL**: Set `DATABASE_URL` for persistent storage
- **Without Database**: Uses in-memory storage (data lost on restart)

To set up PostgreSQL:

```bash
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
```

## 📦 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy on Replit

1. Import this repository to Replit
2. The application will automatically deploy
3. Environment variables can be set in the Secrets tab

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run mcp:stdio` - Start MCP server in stdio mode

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express.js backend
│   ├── services/          # Business logic and services
│   └── routes.ts          # API route definitions
├── shared/                # Shared TypeScript types
└── docs/                  # Documentation
```

## 🔧 Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- shadcn/ui + Radix UI
- Tailwind CSS
- TanStack Query
- Wouter (routing)

**Backend:**
- Express.js + TypeScript
- Drizzle ORM + PostgreSQL
- MCP SDK
- Mozilla Readability
- Turndown
- WebSocket (ws)

**Development:**
- ESBuild
- TypeScript 5.6
- Tailwind CSS
- PostCSS

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Mozilla Readability](https://github.com/mozilla/readability) for content extraction
- [Turndown](https://github.com/mixmark-io/turndown) for HTML to Markdown conversion
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Model Context Protocol](https://github.com/modelcontextprotocol) for AI integration standards

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ by [likhonsdev](https://github.com/likhonsdev)**
