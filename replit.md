# Overview

This is a full-stack web application that provides URL to Markdown conversion services through a Model Context Protocol (MCP) server. The application features a React frontend with a shadcn/ui component library and an Express.js backend that integrates with the MCP SDK to expose conversion tools, resources, and prompts. The system is designed to extract readable content from web pages using Mozilla's Readability library and convert it to clean Markdown format.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **UI Components**: shadcn/ui component library with Radix UI primitives and Tailwind CSS for styling
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: WebSocket integration for live server status updates
- **Theme System**: Custom theme context supporting light/dark modes with system preference detection

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Protocol Integration**: MCP (Model Context Protocol) SDK for exposing tools, resources, and prompts
- **Transport Layer**: Dual transport support - WebSocket and HTTP for MCP communication
- **Middleware**: Custom rate limiting, request logging, and error handling
- **Development Setup**: Vite middleware integration for development server with HMR support

## Data Storage Solutions
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL via Neon Database serverless platform
- **In-Memory Storage**: Fallback MemStorage implementation for development/testing
- **Schema**: Structured tables for users, conversions, server stats, activity logs, and MCP connections

## Authentication and Authorization
- **Session Management**: PostgreSQL session storage using connect-pg-simple
- **Rate Limiting**: Custom implementation with configurable limits per client IP
- **CORS**: Configured for cross-origin requests with credentials support

## External Service Integrations
- **Content Extraction**: Mozilla Readability library for extracting clean content from web pages
- **HTML Processing**: JSDOM for DOM manipulation and parsing
- **Markdown Conversion**: Turndown service for HTML to Markdown transformation
- **WebSocket Communication**: Real-time bidirectional communication for status updates and live data

# External Dependencies

## Core Frameworks and Libraries
- **@modelcontextprotocol/sdk**: MCP protocol implementation for tool/resource/prompt exposure
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **@mozilla/readability**: Content extraction from web pages
- **drizzle-orm**: Type-safe ORM with PostgreSQL support

## Frontend UI and State Management
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router
- **turndown**: HTML to Markdown conversion

## Development and Build Tools
- **vite**: Frontend build tool and development server
- **typescript**: Type safety and enhanced developer experience
- **esbuild**: Fast JavaScript bundler for backend builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Backend Services
- **express**: Web application framework
- **ws**: WebSocket implementation for real-time communication
- **connect-pg-simple**: PostgreSQL session store
- **jsdom**: Server-side DOM implementation for content processing