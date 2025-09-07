import { Link, Users, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ServerStats } from "@shared/schema";

interface StatsCardsProps {
  stats: ServerStats | null;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const statsData = [
    {
      title: "Total Conversions",
      value: stats?.totalConversions || 0,
      icon: Link,
      color: "blue",
      change: "+12.5% from last month",
      testId: "stat-total-conversions"
    },
    {
      title: "Active Connections", 
      value: stats?.activeConnections || 0,
      icon: Users,
      color: "green",
      change: "All connections healthy",
      testId: "stat-active-connections"
    },
    {
      title: "Average Response",
      value: `${stats?.averageResponseTime || 0}ms`,
      icon: Zap,
      color: "amber",
      change: "-15ms from yesterday",
      testId: "stat-average-response"
    },
    {
      title: "Success Rate",
      value: `${stats?.successRate || 0}%`,
      icon: CheckCircle,
      color: "green",
      change: "Excellent performance",
      testId: "stat-success-rate"
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-lg"></div>
                </div>
                <div className="mt-2 h-3 bg-muted rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
          green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", 
          amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
        };

        return (
          <Card key={stat.title} data-testid={stat.testId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold" data-testid={`${stat.testId}-value`}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  colorClasses[stat.color as keyof typeof colorClasses]
                )}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                {stat.change}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
