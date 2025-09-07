import { Server, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ServerStatus, ServerStats } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ServerStatusCardProps {
  status: ServerStatus;
  stats: ServerStats | null;
  isLoading: boolean;
}

export function ServerStatusCard({ status, stats, isLoading }: ServerStatusCardProps) {
  const statusItems = [
    {
      label: "MCP Protocol",
      status: status.protocolStatus,
      testId: "status-mcp-protocol"
    },
    {
      label: "WebSocket Transport",
      status: status.websocketStatus === 'connected' ? 'active' : 'inactive',
      testId: "status-websocket"
    },
    {
      label: "HTTP Transport", 
      status: status.httpStatus === 'available' ? 'active' : 'inactive',
      testId: "status-http"
    },
    {
      label: "Rate Limiting",
      status: status.rateLimitingStatus,
      testId: "status-rate-limiting"
    },
  ];

  const getStatusColor = (status: string) => {
    return status === 'active' || status === 'connected' || status === 'available' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const getStatusIndicator = (status: string) => {
    return status === 'active' || status === 'connected' || status === 'available'
      ? 'status-online'
      : 'status-offline';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded w-32"></div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Server className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Server Status</h2>
        </div>

        <div className="space-y-4">
          {statusItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between" data-testid={item.testId}>
              <span className="text-sm font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "status-indicator",
                  getStatusIndicator(item.status)
                )} />
                <span className={cn("text-sm capitalize", getStatusColor(item.status))}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {stats && (
          <div className="mt-6 p-4 bg-muted rounded-lg" data-testid="resource-usage">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4" />
              <h3 className="text-sm font-medium">Resource Usage</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>CPU Usage</span>
                  <span data-testid="cpu-usage-value">{stats.cpuUsage}%</span>
                </div>
                <Progress value={stats.cpuUsage} className="h-2" data-testid="cpu-usage-bar" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Memory Usage</span>
                  <span data-testid="memory-usage-value">{stats.memoryUsage}MB / 1GB</span>
                </div>
                <Progress 
                  value={((stats.memoryUsage || 0) / 1024) * 100} 
                  className="h-2" 
                  data-testid="memory-usage-bar"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
