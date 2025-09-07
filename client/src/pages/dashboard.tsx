import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UrlConverterCard } from "@/components/dashboard/url-converter-card";
import { ServerStatusCard } from "@/components/dashboard/server-status-card";
import { ActivityLogs } from "@/components/dashboard/activity-logs";
import type { ServerStats, ServerStatus } from "@shared/schema";
import { cn } from "@/lib/utils"; // Assuming cn is in lib/utils

export default function Dashboard() {
  const { data: statsResponse, isLoading: statsLoading, refetch: refetchStats } = useQuery<{data: ServerStats}>({
    queryKey: ["/api/stats"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: statusResponse, isLoading: statusLoading } = useQuery<{data: ServerStatus}>({
    queryKey: ["/api/status"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const stats = statsResponse?.data;
  const status = statusResponse?.data;

  const handleRefresh = () => {
    refetchStats();
  };

  const defaultStatus: ServerStatus = {
    protocolStatus: 'inactive',
    websocketStatus: 'disconnected',
    httpStatus: 'unavailable',
    rateLimitingStatus: 'inactive',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Dashboard"
        description="Monitor and manage your MCP server"
        onRefresh={handleRefresh}
        isLoading={statsLoading}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Monitor your URL conversion service and server status
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatsCards stats={stats || null} isLoading={statsLoading} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              <UrlConverterCard />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <ServerStatusCard
                status={status || defaultStatus}
                stats={stats || null}
                isLoading={statusLoading}
              />
            </div>
          </div>

          <div className="w-full">
            <ActivityLogs />
          </div>
        </div>
      </main>
    </div>
  );
}