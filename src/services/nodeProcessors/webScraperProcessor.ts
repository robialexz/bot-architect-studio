import { NodeProcessor, NodeExecutionResult, ExecutionContext } from '@/types/execution';
import { logger } from '@/lib/logger';
import { WebScrapingService, ScrapingOptions } from '../webScrapingService';

export class WebScraperProcessor implements NodeProcessor {
  canProcess(nodeType: string): boolean {
    return ['web-scraper', 'scraper', 'web-crawler', 'url-fetcher'].includes(nodeType);
  }

  getRequiredInputs(node: Record<string, unknown>): string[] {
    // URL is always required
    const required = ['url'];

    // Add custom required inputs from node configuration
    if (node.data?.requiredInputs) {
      required.push(...node.data.requiredInputs);
    }

    return required;
  }

  validateInputs(node: Record<string, unknown>, inputs: Record<string, unknown>): boolean {
    const required = this.getRequiredInputs(node);

    for (const input of required) {
      if (!(input in inputs) || inputs[input] === undefined || inputs[input] === '') {
        logger.warn('Missing required input for web scraper node', {
          nodeId: node.id,
          missingInput: input,
          availableInputs: Object.keys(inputs),
        });
        return false;
      }
    }

    // Validate URL format
    if (inputs.url && !this.isValidUrl(inputs.url)) {
      logger.warn('Invalid URL format', { nodeId: node.id, url: inputs.url });
      return false;
    }

    return true;
  }

  async processNode(
    node: Record<string, unknown>,
    inputs: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const startTime = new Date();

    logger.info('Processing web scraper node', {
      nodeId: node.id,
      url: inputs.url,
      executionId: context.executionId,
    });

    try {
      if (!this.validateInputs(node, inputs)) {
        throw new Error('Invalid inputs for web scraper node');
      }

      // Prepare scraping options
      const scrapingOptions = this.prepareScrapingOptions(node, inputs);

      // Perform web scraping
      const scrapingResult = await WebScrapingService.scrapeWebsite(scrapingOptions);

      if (!scrapingResult.success) {
        throw new Error(scrapingResult.error || 'Web scraping failed');
      }

      // Process and format the results
      const outputs = this.processScrapingResult(node, scrapingResult, inputs);

      const processingTime = Date.now() - startTime.getTime();

      logger.info('Web scraper node completed', {
        nodeId: node.id,
        url: inputs.url,
        contentLength: scrapingResult.content?.length || 0,
        processingTime,
      });

      return {
        nodeId: node.id,
        nodeType: node.type,
        status: 'completed',
        inputs,
        outputs,
        processingTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      logger.error('Web scraper node failed', {
        nodeId: node.id,
        url: inputs.url,
        error: errorMessage,
        executionId: context.executionId,
      });

      return {
        nodeId: node.id,
        nodeType: node.type,
        status: 'failed',
        inputs,
        outputs: {
          success: false,
          error: errorMessage,
          url: inputs.url,
          timestamp: Date.now(),
        },
        error: errorMessage,
        processingTime: Date.now() - startTime.getTime(),
      };
    }
  }

  private prepareScrapingOptions(
    node: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): ScrapingOptions {
    const nodeData = node.data || {};

    const options: ScrapingOptions = {
      url: inputs.url,
      selector: inputs.selector || nodeData.selector,
      waitFor: inputs.waitFor || nodeData.waitFor || 1000,
      userAgent: inputs.userAgent || nodeData.userAgent,
      headers: {
        ...nodeData.headers,
        ...inputs.headers,
      },
      extractText: inputs.extractText !== false && nodeData.extractText !== false,
      extractLinks: inputs.extractLinks || nodeData.extractLinks || false,
      extractImages: inputs.extractImages || nodeData.extractImages || false,
      maxRetries: inputs.maxRetries || nodeData.maxRetries || 3,
    };

    // Handle special cases for known websites
    if (this.isGSPUrl(options.url)) {
      options.selector =
        options.selector ||
        '.article-title, .news-title, .title, h1, h2, h3, .content, .article-content';
      options.waitFor = 2000;
      options.headers = {
        ...options.headers,
        'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.8',
      };
    }

    return options;
  }

  private processScrapingResult(
    node: Record<string, unknown>,
    result: Record<string, unknown>,
    originalInputs: Record<string, unknown>
  ): Record<string, unknown> {
    const outputs: Record<string, unknown> = {
      success: result.success,
      url: result.url,
      title: result.title || '',
      content: result.content || '',
      text: result.text || '',
      timestamp: result.timestamp,
      ...originalInputs,
    };

    // Add optional data if available
    if (result.links && result.links.length > 0) {
      outputs.links = result.links;
      outputs.linkCount = result.links.length;
    }

    if (result.images && result.images.length > 0) {
      outputs.images = result.images;
      outputs.imageCount = result.images.length;
    }

    if (result.metadata) {
      outputs.metadata = result.metadata;
    }

    // Format content for better readability
    if (outputs.content) {
      outputs.formattedContent = this.formatContent(outputs.content);
      outputs.contentLength = outputs.content.length;
      outputs.wordCount = this.countWords(outputs.content);
    }

    // Extract key information for GSP or news sites
    if (this.isGSPUrl(result.url) || this.isNewsUrl(result.url)) {
      outputs.newsArticles = this.extractNewsArticles(outputs.content, outputs.title);
    }

    return outputs;
  }

  private formatContent(content: string): string {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n');
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private extractNewsArticles(content: string, title: string): Record<string, unknown>[] {
    const articles: Record<string, unknown>[] = [];

    // Split content into potential articles
    const sections = content.split(/\n\n+/);

    sections.forEach((section, index) => {
      const trimmed = section.trim();
      if (trimmed.length > 50) {
        // Minimum length for an article
        articles.push({
          id: index + 1,
          title: this.extractTitleFromSection(trimmed),
          content: trimmed,
          wordCount: this.countWords(trimmed),
        });
      }
    });

    return articles;
  }

  private extractTitleFromSection(section: string): string {
    const lines = section.split('\n');
    const firstLine = lines[0].trim();

    // If first line looks like a title (short and doesn't end with punctuation)
    if (firstLine.length < 100 && !firstLine.match(/[.!?]$/)) {
      return firstLine;
    }

    // Extract first few words as title
    const words = firstLine.split(' ').slice(0, 8);
    return words.join(' ') + (words.length === 8 ? '...' : '');
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isGSPUrl(url: string): boolean {
    return url.toLowerCase().includes('gsp.ro');
  }

  private isNewsUrl(url: string): boolean {
    const newsKeywords = ['news', 'stiri', 'sport', 'actualitate', 'breaking'];
    const lowerUrl = url.toLowerCase();
    return newsKeywords.some(keyword => lowerUrl.includes(keyword));
  }
}
