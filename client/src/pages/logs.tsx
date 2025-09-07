import { Header } from "@/components/layout/header";
import { ActivityLogs } from "@/components/dashboard/activity-logs";

export default function Logs() {
  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Logs"
        description="View server activity and events"
      />

      <main className="flex-1 p-6 overflow-auto">
        <ActivityLogs />
      </main>
    </div>
  );
}
