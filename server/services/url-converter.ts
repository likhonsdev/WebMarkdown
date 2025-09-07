import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { logger } from "./logger";

export interface ConversionOptions {
  includeImages?: boolean;
  cleanHtml?: boolean;
}

export interface ConversionResult {
  markdown: string;
  title: string;
  url: string;
}

export class UrlConverter {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: "atx",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
    });

    // Configure Turndown rules
    this.configureTurndown();
  }

  private configureTurndown() {
    // Remove unwanted elements
    this.turndownService.remove(['script', 'style', 'nav', 'footer', 'aside']);

    // Custom rule for images
    this.turndownService.addRule('images', {
      filter: 'img',
      replacement: (content: any, node: any) => {
        const alt = node.getAttribute('alt') || '';
        const src = node.getAttribute('src') || '';
        const title = node.getAttribute('title') || '';
        
        if (!src) return '';
        
        // Convert relative URLs to absolute URLs if possible
        let absoluteSrc = src;
        if (src.startsWith('/') && node.baseURI) {
          try {
            const base = new URL(node.baseURI);
            absoluteSrc = new URL(src, base.origin).href;
          } catch (e) {
            // Keep original src if URL parsing fails
          }
        }
        
        return title 
          ? `![${alt}](${absoluteSrc} "${title}")`
          : `![${alt}](${absoluteSrc})`;
      }
    });

    // Custom rule for links
    this.turndownService.addRule('links', {
      filter: 'a',
      replacement: (content: any, node: any) => {
        const href = node.getAttribute('href') || '';
        const title = node.getAttribute('title') || '';
        
        if (!href || href.startsWith('#')) {
          return content;
        }
        
        // Convert relative URLs to absolute URLs if possible
        let absoluteHref = href;
        if (href.startsWith('/') && node.baseURI) {
          try {
            const base = new URL(node.baseURI);
            absoluteHref = new URL(href, base.origin).href;
          } catch (e) {
            // Keep original href if URL parsing fails
          }
        }
        
        return title 
          ? `[${content}](${absoluteHref} "${title}")`
          : `[${content}](${absoluteHref})`;
      }
    });
  }

  async convertUrl(url: string, options: ConversionOptions = {}): Promise<ConversionResult> {
    const { includeImages = true, cleanHtml = false } = options;

    try {
      // Validate URL
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Only HTTP and HTTPS URLs are supported');
      }

      await logger.info(`Starting conversion for URL: ${url}`, { options });

      // Fetch the webpage
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MCP-URL-Converter/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const dom = new JSDOM(html, { url });
      const document = dom.window.document;

      let content: Element;
      let title: string;

      if (cleanHtml) {
        // Use Readability for clean content extraction
        const reader = new Readability(document, {
          debug: false,
          charThreshold: 500,
          classesToPreserve: ['highlight', 'code'],
          keepClasses: false,
        });

        const article = reader.parse();
        if (!article) {
          throw new Error('Failed to extract readable content from the page');
        }

        // Create a new document with the cleaned content
        const cleanDom = new JSDOM(`<div>${article.content}</div>`, { url });
        content = cleanDom.window.document.body.firstElementChild!;
        title = article.title || document.title || 'Untitled';
      } else {
        // Use the entire body
        content = document.body;
        title = document.title || 'Untitled';
      }

      // Remove images if not requested
      if (!includeImages) {
        const images = content.querySelectorAll('img');
        images.forEach(img => img.remove());
      }

      // Convert to markdown
      const markdown = this.turndownService.turndown(content as HTMLElement);

      await logger.success(`Successfully converted URL: ${url}`, {
        title,
        markdownLength: markdown.length,
        includeImages,
        cleanHtml,
      });

      return {
        markdown: markdown.trim(),
        title: title.trim(),
        url,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      await logger.error(`Failed to convert URL: ${url}`, { error: errorMessage, options });
      throw new Error(`Conversion failed: ${errorMessage}`);
    }
  }
}

export const urlConverter = new UrlConverter();
