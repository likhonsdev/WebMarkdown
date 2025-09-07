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
      {/* Responsive header for non-converter pages */}
      {location !== "/" && (
        <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg sm:text-xl font-semibold truncate">
                URL to Markdown
              </Link>
              <nav className="flex items-center gap-1 sm:gap-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleTheme}
                  className="w-8 h-8 sm:w-9 sm:h-9"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
              </nav>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 w-full">
        <Switch>
          <Route path="/" component={UrlConverter} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/server-management" component={ServerManagement} />
          <Route path="/resources" component={Resources} />
          <Route path="/logs" component={Logs} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
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