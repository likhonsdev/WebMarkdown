import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Settings"
        description="Configure server settings and preferences"
      />

      <main className="flex-1 p-6 overflow-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              Settings panel coming soon...
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
