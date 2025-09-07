import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Moon, Sun, BarChart3 } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { Link } from "wouter";
import type { ConversionRequest } from "@shared/schema";
import { Copy } from "lucide-react";

export default function UrlConverter() {
  const [url, setUrl] = useState("");
  const [includeImages, setIncludeImages] = useState(true);
  const [cleanHtml, setCleanHtml] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const convertMutation = useMutation({
    mutationFn: async (data: ConversionRequest) => {
      const response = await apiRequest("POST", "/api/convert", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data.data.markdown);
      toast({
        title: "Success",
        description: "URL converted to markdown",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to convert URL",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    convertMutation.mutate({
      url: url.trim(),
      includeImages,
      cleanHtml,
    });
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: "Copied to clipboard",
        description: "Markdown has been successfully copied.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">URL to Markdown Converter</h1>
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

      {/* Main content */}
      <div className="flex flex-col items-center justify-start p-6">
        <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground" data-testid="header-title">
            URL to Markdown
          </h1>
          <p className="text-muted-foreground" data-testid="header-description">
            Convert any web page to clean markdown format
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="conversion-form">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">Website URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full border-2 focus:border-primary transition-colors"
                data-testid="input-url"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-muted/50">
                <Checkbox
                  id="includeImages"
                  checked={includeImages}
                  onCheckedChange={(checked) => setIncludeImages(checked as boolean)}
                  data-testid="checkbox-include-images"
                />
                <Label htmlFor="includeImages" className="text-sm cursor-pointer font-medium">
                  Include images
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-muted/50">
                <Checkbox
                  id="cleanHtml"
                  checked={cleanHtml}
                  onCheckedChange={(checked) => setCleanHtml(checked as boolean)}
                  data-testid="checkbox-clean-html"
                />
                <Label htmlFor="cleanHtml" className="text-sm cursor-pointer font-medium">
                  Clean HTML (Readability)
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold" 
              disabled={convertMutation.isPending}
              data-testid="button-convert"
            >
              {convertMutation.isPending ? "Converting..." : "Convert to Markdown"}
            </Button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4" data-testid="conversion-result">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Output Markdown</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy} aria-label="Copy markdown">
                <Copy className="w-4 h-4 mr-1" /> Copy
              </Button>
            </div>
            <Textarea
              value={result}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="Converted markdown will appear here..."
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Uses{" "}
            <a href="https://www.mozilla.org/" className="underline">
              Mozilla Readability
            </a>
            ,{" "}
            <a href="https://github.com/mixmark-io/turndown" className="underline">
              Turndown
            </a>
            {" "}and{" "}
            <a href="https://github.com/jsdom/jsdom" className="underline">
              jsdom
            </a>
            .
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}