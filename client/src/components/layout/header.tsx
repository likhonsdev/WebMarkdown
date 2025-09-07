import { Moon, Sun, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function Header({ title, description, onRefresh, isLoading }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="header-title">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground" data-testid="header-description">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          {onRefresh && (
            <Button 
              onClick={onRefresh}
              disabled={isLoading}
              data-testid="button-refresh"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}