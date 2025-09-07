import { ExternalLink, Heart, Code } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm font-semibold">URL to Markdown</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Convert any web page to clean, readable markdown format using advanced content extraction.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-medium">Features</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Mozilla Readability Engine</li>
              <li>• Clean Markdown Output</li>
              <li>• Image & Media Support</li>
              <li>• Real-time Processing</li>
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-medium">Navigation</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/logs" className="hover:text-foreground transition-colors hover:underline">
                  Activity Logs
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-foreground transition-colors hover:underline">
                  Settings
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-foreground transition-colors hover:underline">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-medium">Technology</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Built with MCP (Model Context Protocol) for seamless AI integration and modern web technologies.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                MCP Server
              </Badge>
              <Badge variant="outline" className="text-xs">
                React
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © 2024 URL to Markdown Converter. Built with modern web technologies.
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <Badge variant="secondary" className="text-xs">
                MCP v1.17.5
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Status: Active
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}