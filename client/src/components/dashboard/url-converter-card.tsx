import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ConversionRequest } from "@shared/schema";

export function UrlConverterCard() {
  const [url, setUrl] = useState("");
  const [includeImages, setIncludeImages] = useState(true);
  const [cleanHtml, setCleanHtml] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const convertMutation = useMutation({
    mutationFn: async (data: ConversionRequest) => {
      const response = await apiRequest("POST", "/api/convert", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data.markdown);
      toast({
        title: "Conversion completed",
        description: "URL successfully converted to markdown",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Conversion failed",
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

  const handleCopy = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Markdown content copied successfully",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">URL to Markdown Converter</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-url-conversion">
          <div>
            <Label htmlFor="url-input">Enter URL</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={convertMutation.isPending}
              data-testid="input-url"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-images"
                checked={includeImages}
                onCheckedChange={(checked) => setIncludeImages(checked as boolean)}
                data-testid="checkbox-include-images"
              />
              <Label htmlFor="include-images" className="text-sm">
                Include Images
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="clean-html"
                checked={cleanHtml}
                onCheckedChange={(checked) => setCleanHtml(checked as boolean)}
                data-testid="checkbox-clean-html"
              />
              <Label htmlFor="clean-html" className="text-sm">
                Clean HTML
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={convertMutation.isPending}
            data-testid="button-convert"
          >
            <Download className="w-4 h-4 mr-2" />
            {convertMutation.isPending ? "Converting..." : "Convert to Markdown"}
          </Button>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg" data-testid="conversion-result">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Conversion Result</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                data-testid="button-copy-result"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="code-block text-xs max-h-64 overflow-y-auto">
              {result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
