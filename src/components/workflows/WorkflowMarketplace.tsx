/**
 * Workflow Marketplace - Community marketplace for sharing and discovering workflows
 * Provides a platform for users to publish, discover, and monetize workflows
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Store, 
  Search, 
  Filter, 
  Star, 
  Download, 
  DollarSign, 
  TrendingUp,
  Heart,
  Share,
  Eye,
  MessageSquare,
  Award,
  Verified,
  Crown,
  Zap,
  Bot,
  FileText,
  BarChart3,
  Image,
  Globe,
  Calendar,
  Users,
  ThumbsUp,
  Flag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MarketplaceWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    username: string;
    avatar?: string;
    verified: boolean;
    reputation: number;
  };
  pricing: {
    type: 'free' | 'paid' | 'freemium';
    price?: number;
    currency?: string;
  };
  stats: {
    downloads: number;
    rating: number;
    reviews: number;
    likes: number;
    views: number;
  };
  featured: boolean;
  trending: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  preview_image?: string;
  demo_url?: string;
  created_at: string;
  updated_at: string;
}

interface MarketplaceFilters {
  search: string;
  category: string;
  pricing: string;
  difficulty: string;
  rating: number;
  featured: boolean;
  trending: boolean;
  sortBy: 'popular' | 'newest' | 'rating' | 'downloads' | 'price';
}

export function WorkflowMarketplace() {
  const [workflows, setWorkflows] = useState<MarketplaceWorkflow[]>([]);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    search: '',
    category: 'all',
    pricing: 'all',
    difficulty: 'all',
    rating: 0,
    featured: false,
    trending: false,
    sortBy: 'popular'
  });
  const [selectedWorkflow, setSelectedWorkflow] = useState<MarketplaceWorkflow | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMarketplaceWorkflows();
  }, [filters]);

  const loadMarketplaceWorkflows = async () => {
    try {
      setIsLoading(true);
      
      // Mock marketplace data
      const mockWorkflows: MarketplaceWorkflow[] = [
        {
          id: '1',
          name: 'AI Blog Writer Pro',
          description: 'Professional blog writing workflow with SEO optimization, research, and multi-language support',
          category: 'content',
          tags: ['blog', 'seo', 'writing', 'research', 'multilingual'],
          author: {
            id: 'author1',
            username: 'ContentMaster',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=content',
            verified: true,
            reputation: 4.9
          },
          pricing: {
            type: 'paid',
            price: 29.99,
            currency: 'USD'
          },
          stats: {
            downloads: 2450,
            rating: 4.8,
            reviews: 156,
            likes: 890,
            views: 12500
          },
          featured: true,
          trending: true,
          difficulty: 'intermediate',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-20T15:30:00Z'
        },
        {
          id: '2',
          name: 'Social Media Scheduler',
          description: 'Automate your social media presence across all platforms with AI-generated content',
          category: 'automation',
          tags: ['social media', 'automation', 'scheduling', 'ai content'],
          author: {
            id: 'author2',
            username: 'SocialBot',
            verified: false,
            reputation: 4.2
          },
          pricing: {
            type: 'freemium'
          },
          stats: {
            downloads: 5670,
            rating: 4.5,
            reviews: 234,
            likes: 1200,
            views: 18900
          },
          featured: false,
          trending: true,
          difficulty: 'beginner',
          created_at: '2024-01-05T14:00:00Z',
          updated_at: '2024-01-18T09:15:00Z'
        },
        {
          id: '3',
          name: 'Data Visualization Suite',
          description: 'Transform raw data into beautiful, interactive charts and dashboards',
          category: 'analysis',
          tags: ['data', 'visualization', 'charts', 'dashboard', 'analytics'],
          author: {
            id: 'author3',
            username: 'DataViz_Pro',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dataviz',
            verified: true,
            reputation: 4.7
          },
          pricing: {
            type: 'paid',
            price: 49.99,
            currency: 'USD'
          },
          stats: {
            downloads: 1890,
            rating: 4.9,
            reviews: 98,
            likes: 650,
            views: 8900
          },
          featured: true,
          trending: false,
          difficulty: 'advanced',
          created_at: '2024-01-12T16:00:00Z',
          updated_at: '2024-01-19T11:45:00Z'
        },
        {
          id: '4',
          name: 'Image Generator Studio',
          description: 'Create stunning images with AI using multiple models and advanced editing tools',
          category: 'creative',
          tags: ['image', 'generation', 'ai art', 'creative', 'editing'],
          author: {
            id: 'author4',
            username: 'AIArtist',
            verified: true,
            reputation: 4.6
          },
          pricing: {
            type: 'free'
          },
          stats: {
            downloads: 8900,
            rating: 4.4,
            reviews: 445,
            likes: 2100,
            views: 25600
          },
          featured: false,
          trending: true,
          difficulty: 'beginner',
          created_at: '2024-01-08T12:00:00Z',
          updated_at: '2024-01-21T14:20:00Z'
        }
      ];

      // Apply filters
      let filteredWorkflows = mockWorkflows.filter(workflow => {
        if (filters.search && !workflow.name.toLowerCase().includes(filters.search.toLowerCase()) &&
            !workflow.description.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        
        if (filters.category !== 'all' && workflow.category !== filters.category) {
          return false;
        }
        
        if (filters.pricing !== 'all' && workflow.pricing.type !== filters.pricing) {
          return false;
        }
        
        if (filters.difficulty !== 'all' && workflow.difficulty !== filters.difficulty) {
          return false;
        }
        
        if (filters.rating > 0 && workflow.stats.rating < filters.rating) {
          return false;
        }
        
        if (filters.featured && !workflow.featured) {
          return false;
        }
        
        if (filters.trending && !workflow.trending) {
          return false;
        }
        
        return true;
      });

      // Apply sorting
      filteredWorkflows.sort((a, b) => {
        switch (filters.sortBy) {
          case 'popular':
            return b.stats.downloads - a.stats.downloads;
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'rating':
            return b.stats.rating - a.stats.rating;
          case 'downloads':
            return b.stats.downloads - a.stats.downloads;
          case 'price':
            const aPrice = a.pricing.price || 0;
            const bPrice = b.pricing.price || 0;
            return aPrice - bPrice;
          default:
            return 0;
        }
      });

      setWorkflows(filteredWorkflows);
      
    } catch (error) {
      console.error('Failed to load marketplace workflows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'analysis':
        return <BarChart3 className="w-4 h-4" />;
      case 'automation':
        return <Zap className="w-4 h-4" />;
      case 'creative':
        return <Image className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getPricingBadge = (pricing: any) => {
    switch (pricing.type) {
      case 'free':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Free</Badge>;
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">${pricing.price}</Badge>;
      case 'freemium':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Freemium</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Store className="w-6 h-6" />
            Workflow Marketplace
          </h2>
          <p className="text-muted-foreground">
            Discover, purchase, and share workflows with the community
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Publish Workflow
          </Button>
          <Button>
            <Crown className="w-4 h-4 mr-2" />
            Become Seller
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search marketplace..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.pricing}
                onValueChange={(value) => setFilters(prev => ({ ...prev, pricing: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pricing</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.checked }))}
              />
              <span className="text-sm">Featured only</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.trending}
                onChange={(e) => setFilters(prev => ({ ...prev, trending: e.target.checked }))}
              />
              <span className="text-sm">Trending only</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(workflow.category)}
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {workflow.name}
                      {workflow.featured && <Award className="w-4 h-4 text-yellow-500" />}
                      {workflow.trending && <TrendingUp className="w-4 h-4 text-green-500" />}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={workflow.author.avatar} />
                        <AvatarFallback className="text-xs">
                          {workflow.author.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{workflow.author.username}</span>
                      {workflow.author.verified && <Verified className="w-4 h-4 text-blue-500" />}
                    </div>
                  </div>
                </div>
                {getPricingBadge(workflow.pricing)}
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {workflow.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(workflow.stats.rating)}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({workflow.stats.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {formatNumber(workflow.stats.downloads)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {formatNumber(workflow.stats.likes)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {workflow.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {workflow.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{workflow.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedWorkflow(workflow);
                    setShowDetails(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workflows.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={() => setFilters({
              search: '',
              category: 'all',
              pricing: 'all',
              difficulty: 'all',
              rating: 0,
              featured: false,
              trending: false,
              sortBy: 'popular'
            })}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Workflow Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedWorkflow && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedWorkflow.category)}
                  {selectedWorkflow.name}
                  {selectedWorkflow.featured && <Award className="w-4 h-4 text-yellow-500" />}
                  {selectedWorkflow.trending && <TrendingUp className="w-4 h-4 text-green-500" />}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={selectedWorkflow.author.avatar} />
                    <AvatarFallback className="text-xs">
                      {selectedWorkflow.author.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  by {selectedWorkflow.author.username}
                  {selectedWorkflow.author.verified && <Verified className="w-4 h-4 text-blue-500" />}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  {getPricingBadge(selectedWorkflow.pricing)}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {renderStars(selectedWorkflow.stats.rating)}
                      <span className="text-sm">({selectedWorkflow.stats.reviews} reviews)</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(selectedWorkflow.stats.downloads)} downloads
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedWorkflow.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <Badge variant="outline">{selectedWorkflow.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <Badge variant="secondary">{selectedWorkflow.difficulty}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>{formatDistanceToNow(new Date(selectedWorkflow.updated_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Views:</span>
                        <span>{formatNumber(selectedWorkflow.stats.views)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Likes:</span>
                        <span>{formatNumber(selectedWorkflow.stats.likes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Downloads:</span>
                        <span>{formatNumber(selectedWorkflow.stats.downloads)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedWorkflow.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button className="flex-1">
                    {selectedWorkflow.pricing.type === 'free' ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Free
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Purchase ${selectedWorkflow.pricing.price}
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
