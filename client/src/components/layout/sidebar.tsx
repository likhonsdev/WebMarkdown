import { Link, useLocation } from "wouter";
import { Server, Home, Link as LinkIcon, FileText, Terminal, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  serverStatus: {
    protocolStatus: 'active' | 'inactive';
    websocketStatus: 'connected' | 'disconnected';
    httpStatus: 'available' | 'unavailable';
    rateLimitingStatus: 'active' | 'inactive';
  };
}

export function Sidebar({ serverStatus }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard", testId: "nav-dashboard" },
    { href: "/url-converter", icon: LinkIcon, label: "URL Converter", testId: "nav-url-converter" },
    { href: "/server-management", icon: Server, label: "Server Management", testId: "nav-server-management" },
    { href: "/resources", icon: FileText, label: "Resources", testId: "nav-resources" },
    { href: "/logs", icon: Terminal, label: "Logs", testId: "nav-logs" },
    { href: "/settings", icon: Settings, label: "Settings", testId: "nav-settings" },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Server className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">MCP Server</h1>
            <p className="text-xs text-muted-foreground">URL to Markdown</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.href}>
                <Link href={item.href} data-testid={item.testId}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  )}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className={cn(
            "status-indicator",
            serverStatus.protocolStatus === 'active' ? "status-online" : "status-offline"
          )} />
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">
              Server {serverStatus.protocolStatus === 'active' ? 'Online' : 'Offline'}
            </p>
            <p className="text-xs text-muted-foreground">Port 5000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
