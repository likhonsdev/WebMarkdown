import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { Sidebar } from "@/components/layout/sidebar";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import Dashboard from "@/pages/dashboard";
import UrlConverter from "@/pages/url-converter";
import ServerManagement from "@/pages/server-management";
import Resources from "@/pages/resources";
import Logs from "@/pages/logs";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import type { ServerStatus } from "@shared/schema";

function AppContent() {
  const { data: statusResponse } = useQuery<{data: ServerStatus}>({
    queryKey: ["/api/status"],
    refetchInterval: 5000,
  });
  
  const status = statusResponse?.data;

  const defaultStatus: ServerStatus = {
    protocolStatus: 'inactive',
    websocketStatus: 'disconnected',
    httpStatus: 'unavailable',
    rateLimitingStatus: 'inactive',
  };

  // Initialize WebSocket connection for real-time updates
  useWebSocket({
    onMessage: (data) => {
      // Handle real-time updates
      if (data.type === 'stats_update') {
        queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      }
      if (data.type === 'log_update') {
        queryClient.invalidateQueries({ queryKey: ["/api/logs"] });
      }
      if (data.type === 'status_update') {
        queryClient.invalidateQueries({ queryKey: ["/api/status"] });
      }
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    },
  });

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar serverStatus={status || defaultStatus} />
      
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/url-converter" component={UrlConverter} />
        <Route path="/server-management" component={ServerManagement} />
        <Route path="/resources" component={Resources} />
        <Route path="/logs" component={Logs} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="mcp-ui-theme">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
