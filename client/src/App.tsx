import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BarChart3 } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import Dashboard from "@/pages/dashboard";
import UrlConverter from "@/pages/url-converter";
import ServerManagement from "@/pages/server-management";
import Resources from "@/pages/resources";
import Logs from "@/pages/logs";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { Link, useLocation } from "wouter";
import type { ServerStatus } from "@shared/schema";
import { Footer } from "./components/layout/footer";

function AppContent() {
  const { data: statusResponse } = useQuery<{data: ServerStatus}>({
    queryKey: ["/api/status"],
    refetchInterval: 5000,
  });

  const status = statusResponse?.data;
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple header for non-converter pages */}
      {location !== "/" && (
        <div className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold">
              URL to Markdown
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        <Switch>
          <Route path="/" component={UrlConverter} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/server-management" component={ServerManagement} />
          <Route path="/resources" component={Resources} />
          <Route path="/logs" component={Logs} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
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