import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, ExternalLink, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Settings"
        description="Configure server settings and preferences"
      />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Credits Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Credits & Attribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Founder & Developer</h3>
                  <p className="text-muted-foreground mb-2">
                    Created and developed by <strong>Likhon Sheikh</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://t.me/likhonsheikh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Contact on Telegram
                    </a>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      Full-Stack Developer
                    </Badge>
                    <Badge variant="outline">Open Source</Badge>
                  </div>
                </div>
              </div>

              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Built with ❤️ using React, TypeScript, and modern web technologies
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  © {new Date().getFullYear()} Likhon Sheikh. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings and configuration options will be available here.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}