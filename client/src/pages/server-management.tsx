import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { ServerStatusCard } from "@/components/dashboard/server-status-card";
import type { ServerStats, ServerStatus } from "@shared/schema";

export default function ServerManagement() {
  const { data: statsResponse, isLoading: statsLoading } = useQuery<{data: ServerStats}>({
    queryKey: ["/api/stats"],
    refetchInterval: 10000,
  });

  const { data: statusResponse, isLoading: statusLoading } = useQuery<{data: ServerStatus}>({
    queryKey: ["/api/status"],
    refetchInterval: 5000,
  });
  
  const stats = statsResponse?.data;
  const status = statusResponse?.data;

  const defaultStatus: ServerStatus = {
    protocolStatus: 'inactive',
    websocketStatus: 'disconnected',
    httpStatus: 'unavailable',
    rateLimitingStatus: 'inactive',
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Server Management"
        description="Monitor and configure server settings"
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <ServerStatusCard 
            status={status || defaultStatus}
            stats={stats || null}
            isLoading={statusLoading}
          />
        </div>
      </main>
    </div>
  );
}
