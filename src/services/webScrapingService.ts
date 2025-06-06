import { logger } from '@/lib/logger';

export interface ScrapingOptions {
  url: string;
  selector?: string;
  waitFor?: number;
  userAgent?: string;
  headers?: Record<string, string>;
  extractText?: boolean;
  extractLinks?: boolean;
  extractImages?: boolean;
  maxRetries?: number;
}

export interface ScrapingResult {
  success: boolean;
  url: string;
  title?: string;
  content?: string;
  text?: string;
  links?: string[];
  images?: string[];
  metadata?: Record<string, any>;
  error?: string;
  timestamp: number;
}

export class WebScrapingService {
  private static readonly DEFAULT_USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private static readonly DEFAULT_HEADERS = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    DNT: '1',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  };

  static async scrapeWebsite(options: ScrapingOptions): Promise<ScrapingResult> {
    const startTime = Date.now();

    logger.info('Starting web scraping', { url: options.url });

    try {
      // Validate URL
      if (!this.isValidUrl(options.url)) {
        throw new Error('Invalid URL provided');
      }

      // Prepare request headers
      const headers = {
        ...this.DEFAULT_HEADERS,
        'User-Agent': options.userAgent || this.DEFAULT_USER_AGENT,
        ...options.headers,
      };

      // Add delay to avoid being blocked
      if (options.waitFor) {
        await this.delay(options.waitFor);
      }

      // Make the request with retries
      const maxRetries = options.maxRetries || 3;
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          logger.info(`Scraping attempt ${attempt}/${maxRetries}`, { url: options.url });

          const response = await fetch(options.url, {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(30000), // 30 second timeout
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const html = await response.text();
          const result = await this.parseHtml(html, options);

          logger.info('Web scraping completed successfully', {
            url: options.url,
            contentLength: result.content?.length || 0,
            processingTime: Date.now() - startTime,
          });

          return {
            ...result,
            success: true,
            url: options.url,
            timestamp: Date.now(),
          };
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          logger.warn(`Scraping attempt ${attempt} failed`, {
            url: options.url,
            error: lastError.message,
          });

          if (attempt < maxRetries) {
            // Exponential backoff
            await this.delay(1000 * Math.pow(2, attempt - 1));
          }
        }
      }

      // All attempts failed
      throw lastError || new Error('All scraping attempts failed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      logger.error('Web scraping failed', {
        url: options.url,
        error: errorMessage,
        processingTime: Date.now() - startTime,
      });

      return {
        success: false,
        url: options.url,
        error: errorMessage,
        timestamp: Date.now(),
      };
    }
  }

  private static async parseHtml(
    html: string,
    options: ScrapingOptions
  ): Promise<Partial<ScrapingResult>> {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const result: Partial<ScrapingResult> = {};

    // Extract title
    const titleElement = doc.querySelector('title');
    if (titleElement) {
      result.title = titleElement.textContent?.trim() || '';
    }

    // Extract content based on selector or default strategy
    if (options.selector) {
      const selectedElements = doc.querySelectorAll(options.selector);
      result.content = Array.from(selectedElements)
        .map(el => el.textContent?.trim())
        .filter(text => text)
        .join('\n\n');
    } else {
      // Default content extraction strategy
      result.content = this.extractMainContent(doc);
    }

    // Extract text if requested
    if (options.extractText !== false) {
      result.text = this.extractCleanText(doc);
    }

    // Extract links if requested
    if (options.extractLinks) {
      result.links = this.extractLinks(doc, options.url);
    }

    // Extract images if requested
    if (options.extractImages) {
      result.images = this.extractImages(doc, options.url);
    }

    // Extract metadata
    result.metadata = this.extractMetadata(doc);

    return result;
  }

  private static extractMainContent(doc: Document): string {
    // Try to find main content areas
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.main-content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      '#main',
    ];

    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        return this.cleanText(element.textContent || '');
      }
    }

    // Fallback: extract from body, excluding navigation and footer
    const body = doc.querySelector('body');
    if (body) {
      // Remove unwanted elements
      const unwantedSelectors = [
        'nav',
        'header',
        'footer',
        '.navigation',
        '.menu',
        '.sidebar',
        'script',
        'style',
      ];
      unwantedSelectors.forEach(selector => {
        const elements = body.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      return this.cleanText(body.textContent || '');
    }

    return '';
  }

  private static extractCleanText(doc: Document): string {
    const body = doc.querySelector('body');
    if (!body) return '';

    // Remove script and style elements
    const scripts = body.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());

    return this.cleanText(body.textContent || '');
  }

  private static extractLinks(doc: Document, baseUrl: string): string[] {
    const links = Array.from(doc.querySelectorAll('a[href]'))
      .map(link => {
        const href = link.getAttribute('href');
        if (!href) return null;

        try {
          return new URL(href, baseUrl).href;
        } catch {
          return null;
        }
      })
      .filter((link): link is string => link !== null);

    return [...new Set(links)]; // Remove duplicates
  }

  private static extractImages(doc: Document, baseUrl: string): string[] {
    const images = Array.from(doc.querySelectorAll('img[src]'))
      .map(img => {
        const src = img.getAttribute('src');
        if (!src) return null;

        try {
          return new URL(src, baseUrl).href;
        } catch {
          return null;
        }
      })
      .filter((src): src is string => src !== null);

    return [...new Set(images)]; // Remove duplicates
  }

  private static extractMetadata(doc: Document): Record<string, any> {
    const metadata: Record<string, any> = {};

    // Extract meta tags
    const metaTags = doc.querySelectorAll('meta');
    metaTags.forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const content = meta.getAttribute('content');

      if (name && content) {
        metadata[name] = content;
      }
    });

    // Extract structured data
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    const structuredData: any[] = [];

    jsonLdScripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '');
        structuredData.push(data);
      } catch {
        // Ignore invalid JSON
      }
    });

    if (structuredData.length > 0) {
      metadata.structuredData = structuredData;
    }

    return metadata;
  }

  private static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
      .trim();
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Specialized scraping methods for common sites
  static async scrapeNews(url: string): Promise<ScrapingResult> {
    return this.scrapeWebsite({
      url,
      selector: 'article, .article, .news-item, .post',
      extractText: true,
      extractLinks: true,
      waitFor: 1000,
      maxRetries: 3,
    });
  }

  static async scrapeGSP(): Promise<ScrapingResult> {
    return this.scrapeWebsite({
      url: 'https://www.gsp.ro',
      selector: '.article-title, .news-title, h1, h2, h3',
      extractText: true,
      extractLinks: true,
      waitFor: 2000,
      maxRetries: 3,
      headers: {
        'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.8',
      },
    });
  }
}
