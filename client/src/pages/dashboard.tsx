import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UrlConverterCard } from "@/components/dashboard/url-converter-card";
import { ServerStatusCard } from "@/components/dashboard/server-status-card";
import { ActivityLogs } from "@/components/dashboard/activity-logs";
import type { ServerStats, ServerStatus } from "@shared/schema";

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
    <div className="flex-1 flex flex-col">
      <Header
        title="Dashboard"
        description="Monitor and manage your MCP server"
        onRefresh={handleRefresh}
        isLoading={statsLoading}
      />

      <main className="flex-1 p-6 overflow-auto">
        <StatsCards stats={stats || null} isLoading={statsLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <UrlConverterCard />
          <ServerStatusCard 
            status={status || defaultStatus}
            stats={stats || null}
            isLoading={statusLoading}
          />
        </div>

        <ActivityLogs />
      </main>
    </div>
  );
}
