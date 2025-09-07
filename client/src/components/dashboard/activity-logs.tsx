import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { ActivityLog } from "@shared/schema";
import { cn } from "@/lib/utils";

export function ActivityLogs() {
  const { data: response, isLoading } = useQuery<{data: ActivityLog[]}>({
    queryKey: ["/api/logs"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const logs = response?.data || [];

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const getLogClassName = (type: string) => {
    const baseClass = "log-entry";
    switch (type) {
      case 'success': return `${baseClass} log-success`;
      case 'warning': return `${baseClass} log-warning`;
      case 'error': return `${baseClass} log-error`;
      default: return `${baseClass} log-info`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-32"></div>
              </div>
              <div className="h-8 bg-muted rounded w-24"></div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-l-4 border-muted pl-3 py-1">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-64"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure logs is always an array
  const logsList = Array.isArray(logs) ? logs : [];

  if (!logsList || logsList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <Button variant="ghost" size="sm" data-testid="button-view-all-logs">
            View All Logs
          </Button>
        </div>

        <div className="space-y-3" data-testid="activity-logs-container">
          {!logsList || logsList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="no-logs-message">
              No recent activity
            </div>
          ) : (
            logsList.slice(0, 5).map((log, index) => (
              <div
                key={log.id}
                className={cn(getLogClassName(log.type), "border-l-4 pl-3 py-1")}
                data-testid={`log-entry-${log.type}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm" data-testid={`log-message-${log.id}`}>
                    {log.message}
                  </span>
                  <span className="text-xs text-muted-foreground" data-testid={`log-time-${log.id}`}>
                    {formatTime(log.createdAt!)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Credited to Likhon Sheikh (https://t.me/likhonsheikh)
        </div>
      </CardContent>
    </Card>
  );
}