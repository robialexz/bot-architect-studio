// X (Twitter) API Integration Service
// Fetches real-time posts from FlowsyAI's X account with rich media support

export interface XPost {
  id: string;
  text: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
    verified: boolean;
  };
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  entities?: {
    urls?: Array<{
      start: number;
      end: number;
      url: string;
      expanded_url: string;
      display_url: string;
    }>;
    hashtags?: Array<{
      start: number;
      end: number;
      tag: string;
    }>;
    mentions?: Array<{
      start: number;
      end: number;
      username: string;
      id: string;
    }>;
  };
  attachments?: {
    media_keys?: string[];
    poll_ids?: string[];
  };
  media?: Array<{
    media_key: string;
    type: 'photo' | 'video' | 'animated_gif';
    url?: string;
    preview_image_url?: string;
    width?: number;
    height?: number;
    duration_ms?: number;
    alt_text?: string;
  }>;
  polls?: Array<{
    id: string;
    options: Array<{
      position: number;
      label: string;
      votes: number;
    }>;
    duration_minutes: number;
    end_datetime: string;
    voting_status: 'open' | 'closed';
  }>;
}

export interface XApiResponse {
  data: XPost[];
  includes?: {
    media?: Array<{
      media_key: string;
      type: 'photo' | 'video' | 'animated_gif';
      url?: string;
      preview_image_url?: string;
      width?: number;
      height?: number;
      duration_ms?: number;
      alt_text?: string;
    }>;
    polls?: Array<{
      id: string;
      options: Array<{
        position: number;
        label: string;
        votes: number;
      }>;
      duration_minutes: number;
      end_datetime: string;
      voting_status: 'open' | 'closed';
    }>;
    users?: Array<{
      id: string;
      name: string;
      username: string;
      profile_image_url: string;
      verified: boolean;
    }>;
  };
  meta: {
    result_count: number;
    newest_id: string;
    oldest_id: string;
    next_token?: string;
  };
}

// No fallback data - only real X API integration

class XService {
  private readonly baseUrl = 'https://api.twitter.com/2';
  private readonly bearerToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
  private readonly username = import.meta.env.VITE_TWITTER_USERNAME || 'flowsyai';
  private cache: { data: XPost[]; timestamp: number } | null = null;
  private readonly cacheTimeout = 10 * 60 * 1000; // 10 minutes for background refresh
  private autoRefreshInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start background auto-refresh
    this.startAutoRefresh();
  }

  private startAutoRefresh() {
    // Auto-refresh every 10 minutes
    this.autoRefreshInterval = setInterval(() => {
      this.fetchUserPosts(5, true); // Silent background refresh
    }, this.cacheTimeout);
  }

  private stopAutoRefresh() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }

  async fetchUserPosts(maxResults: number = 5, silent: boolean = false): Promise<XPost[]> {
    // Check cache first for non-silent requests
    if (!silent && this.cache && Date.now() - this.cache.timestamp < this.cacheTimeout) {
      console.log('📱 Using cached X data');
      return this.cache.data.slice(0, maxResults);
    }

    try {
      if (!this.bearerToken) {
        throw new Error('X API Bearer Token is required for real data integration');
      }

      const response = await this.makeApiRequest(maxResults);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`X API error: ${response.status} - ${errorText}`);
      }

      const data: XApiResponse = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('No posts received from X API');
      }

      // Process and cache the data
      const processedPosts = this.processPosts(data);
      this.cache = {
        data: processedPosts,
        timestamp: Date.now()
      };

      if (!silent) {
        console.log(`📱 Fetched ${processedPosts.length} posts from X API`);
      }
      return processedPosts.slice(0, maxResults);

    } catch (error) {
      console.error('📱 X API error:', error);
      throw error; // No fallback - require real data
    }
  }

  private async makeApiRequest(maxResults: number): Promise<Response> {
    const params = new URLSearchParams({
      'user.fields': 'id,name,username,profile_image_url,verified',
      'tweet.fields': 'created_at,public_metrics,attachments,entities,referenced_tweets',
      'media.fields': 'media_key,type,url,preview_image_url,width,height,duration_ms,alt_text',
      'poll.fields': 'id,options,duration_minutes,end_datetime,voting_status',
      'expansions': 'attachments.media_keys,attachments.poll_ids,referenced_tweets.id,referenced_tweets.id.author_id',
      'max_results': maxResults.toString(),
      'exclude': 'retweets' // Include replies but exclude retweets
    });

    return fetch(`${this.baseUrl}/users/by/username/${this.username}/tweets?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private processPosts(data: XApiResponse): XPost[] {
    return data.data.map(post => ({
      ...post,
      media: data.includes?.media?.filter(media => 
        post.attachments?.media_keys?.includes(media.media_key)
      ),
      polls: data.includes?.polls?.filter(poll => 
        post.attachments?.poll_ids?.includes(poll.id)
      )
    }));
  }

  // Cleanup method for component unmount
  destroy() {
    this.stopAutoRefresh();
  }

  // Utility function to format relative time
  static formatRelativeTime(dateString: string): string {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Utility function to format engagement numbers
  static formatEngagementNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  // Utility function to process text with entities (hashtags, mentions, URLs)
  static processTextWithEntities(text: string, entities?: XPost['entities']): string {
    if (!entities) return text;

    let processedText = text;
    
    // Process URLs
    if (entities.urls) {
      entities.urls.forEach(url => {
        processedText = processedText.replace(url.url, url.display_url);
      });
    }

    return processedText;
  }
}

export const xService = new XService();
export { XService };
export default xService;
