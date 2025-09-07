import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";

export default function Resources() {
  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Resources"
        description="Manage MCP server resources"
      />

      <main className="flex-1 p-6 overflow-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              Resources management coming soon...
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
