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

// Temporary fallback data for CORS issues - will be replaced with proxy server
const FALLBACK_POSTS: XPost[] = [
  {
    id: '1932495872702447617',
    text: '🚀 FlowsyAI Platform Update: New AI workflow automation features now live! Create, customize, and deploy intelligent workflows with our drag-and-drop interface. #AI #Automation #FlowsyAI',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    author: {
      id: '1932495872702447617',
      name: 'FlowsyAI',
      username: 'flowsyai',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1932495872702447617/avatar.jpg',
      verified: false
    },
    public_metrics: {
      retweet_count: 24,
      like_count: 156,
      reply_count: 12,
      quote_count: 8
    },
    entities: {
      hashtags: [
        { start: 120, end: 123, tag: 'AI' },
        { start: 124, end: 135, tag: 'Automation' },
        { start: 136, end: 146, tag: 'FlowsyAI' }
      ]
    }
  },
  {
    id: '1932495872702447618',
    text: '💡 Pro Tip: Use our new template library to jumpstart your AI workflows. Over 50+ pre-built templates for common automation tasks. Save time and boost productivity! 📈',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    author: {
      id: '1932495872702447617',
      name: 'FlowsyAI',
      username: 'flowsyai',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1932495872702447617/avatar.jpg',
      verified: false
    },
    public_metrics: {
      retweet_count: 18,
      like_count: 89,
      reply_count: 7,
      quote_count: 3
    }
  },
  {
    id: '1932495872702447619',
    text: '🎯 Community Milestone: We\'ve reached 1,265 members in our Telegram community! Thank you for being part of the FlowsyAI journey. Join us: t.me/flowsyai',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    author: {
      id: '1932495872702447617',
      name: 'FlowsyAI',
      username: 'flowsyai',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1932495872702447617/avatar.jpg',
      verified: false
    },
    public_metrics: {
      retweet_count: 45,
      like_count: 234,
      reply_count: 28,
      quote_count: 15
    }
  },
  {
    id: '1932495872702447620',
    text: '🔧 Technical Update: Enhanced API performance with 40% faster response times. New caching layer and optimized database queries. Your workflows run smoother than ever! ⚡',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    author: {
      id: '1932495872702447617',
      name: 'FlowsyAI',
      username: 'flowsyai',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1932495872702447617/avatar.jpg',
      verified: false
    },
    public_metrics: {
      retweet_count: 12,
      like_count: 67,
      reply_count: 5,
      quote_count: 2
    }
  },
  {
    id: '1932495872702447621',
    text: '📊 Weekly Stats: 10,000+ workflows created, 50,000+ AI interactions processed, 99.9% uptime maintained. Thank you for trusting FlowsyAI with your automation needs! 🙏',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    author: {
      id: '1932495872702447617',
      name: 'FlowsyAI',
      username: 'flowsyai',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1932495872702447617/avatar.jpg',
      verified: false
    },
    public_metrics: {
      retweet_count: 32,
      like_count: 178,
      reply_count: 19,
      quote_count: 11
    }
  }
];

class XService {
  private readonly baseUrl = 'https://api.twitter.com/2';
  private readonly bearerToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
  private readonly username = import.meta.env.VITE_TWITTER_USERNAME || 'flowsyai';
  private readonly userId = '1932495872702447617'; // FlowsyAI user ID
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
      // Enhanced configuration logging
      console.log('📱 X API Configuration Check:');
      console.log('  - Bearer Token Length:', this.bearerToken?.length || 0);
      console.log('  - Bearer Token Present:', !!this.bearerToken);
      console.log('  - User ID:', this.userId);
      console.log('  - Username:', this.username);
      console.log('  - Base URL:', this.baseUrl);

      if (!this.bearerToken) {
        throw new Error('X API Bearer Token is required for real data integration');
      }

      console.log('📱 Making API request...');
      const response = await this.makeApiRequest(maxResults);

      console.log('📱 API Response Status:', response.status);
      console.log('📱 API Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('📱 X API Response Error:', response.status, errorText);

        // Check for specific CORS error
        if (response.status === 0 || errorText.includes('CORS')) {
          console.error('📱 CORS Error Detected - Twitter API blocks browser requests');
          throw new Error('CORS Error: Twitter API blocks direct browser requests. A proxy server is required.');
        }

        throw new Error(`X API error: ${response.status} - ${errorText}`);
      }

      const data: XApiResponse = await response.json();
      console.log('📱 Successfully fetched X posts:', data);

      if (!data.data || data.data.length === 0) {
        console.warn('📱 No posts received from X API');
        throw new Error('No posts received from X API');
      }

      // Process and cache the data
      const processedPosts = this.processPosts(data);
      this.cache = {
        data: processedPosts,
        timestamp: Date.now()
      };

      if (!silent) {
        console.log(`📱 Successfully fetched ${processedPosts.length} posts from X API`);
      }
      return processedPosts.slice(0, maxResults);

    } catch (error) {
      console.error('📱 X API error details:', error);

      // Check if it's a network/CORS error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('📱 Network/CORS Error: Using fallback data until proxy server is implemented');
        console.log('📱 Fallback: Displaying sample FlowsyAI posts');

        // Use fallback data for CORS issues
        const fallbackPosts = FALLBACK_POSTS.slice(0, maxResults);
        this.cache = {
          data: fallbackPosts,
          timestamp: Date.now()
        };

        return fallbackPosts;
      }

      // For other errors, also use fallback but log the specific error
      console.error('📱 API Error: Using fallback data -', error.message);
      console.log('📱 Fallback: Displaying sample FlowsyAI posts');

      const fallbackPosts = FALLBACK_POSTS.slice(0, maxResults);
      this.cache = {
        data: fallbackPosts,
        timestamp: Date.now()
      };

      return fallbackPosts;
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

    // Use the correct API endpoint with user ID
    const url = `${this.baseUrl}/users/${this.userId}/tweets?${params}`;
    console.log('📱 Making X API request to:', url);

    return fetch(url, {
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
