
import { ExternalLink, Heart, Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border px-6 py-4 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-red-500" />
          <span>by</span>
          <a 
            href="https://t.me/likhonsheikh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline font-medium"
          >
            Likhon Sheikh
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span>© {new Date().getFullYear()} All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
