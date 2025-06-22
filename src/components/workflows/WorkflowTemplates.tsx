/**
 * Workflow Templates - Template marketplace and management
 * Provides pre-built workflow templates for quick start
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Play, 
  Heart,
  Share,
  Copy,
  Zap,
  Bot,
  FileText,
  BarChart3,
  Image,
  Code,
  Globe,
  Sparkles,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { useWorkflows } from '@/hooks/useWorkflows';
import { formatDistanceToNow } from 'date-fns';
import { WorkflowSharing } from './WorkflowSharing';
import { WorkflowMarketplace } from './WorkflowMarketplace';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  downloads: number;
  rating: number;
  reviews: number;
  featured: boolean;
  premium: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  preview_image?: string;
  workflow_data: any;
  created_at: string;
  updated_at: string;
}

interface TemplateFilters {
  search: string;
  category: string;
  difficulty: string;
  featured: boolean;
  premium: boolean;
  sortBy: 'popular' | 'newest' | 'rating' | 'downloads';
}

export function WorkflowTemplates() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [filters, setFilters] = useState<TemplateFilters>({
    search: '',
    category: 'all',
    difficulty: 'all',
    featured: false,
    premium: false,
    sortBy: 'popular'
  });
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { createWorkflow } = useWorkflows();

  useEffect(() => {
    loadTemplates();
  }, [filters]);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      
      // Mock template data - would come from API
      const mockTemplates: WorkflowTemplate[] = [
        {
          id: '1',
          name: 'AI Content Generator',
          description: 'Generate high-quality blog posts, articles, and marketing copy using GPT-4',
          category: 'content',
          tags: ['content', 'writing', 'marketing', 'gpt-4'],
          author: 'FlowsyAI Team',
          downloads: 1250,
          rating: 4.8,
          reviews: 89,
          featured: true,
          premium: false,
          difficulty: 'beginner',
          estimatedTime: '5 minutes',
          workflow_data: {
            nodes: [
              { id: 'input', type: 'input', data: { label: 'Topic Input' } },
              { id: 'gpt4', type: 'ai_model', data: { label: 'GPT-4', model: 'gpt-4' } },
              { id: 'output', type: 'output', data: { label: 'Generated Content' } }
            ],
            connections: [
              { source: 'input', target: 'gpt4' },
              { source: 'gpt4', target: 'output' }
            ]
          },
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T15:30:00Z'
        },
        {
          id: '2',
          name: 'Data Analysis Pipeline',
          description: 'Analyze CSV data, generate insights, and create visualizations automatically',
          category: 'analysis',
          tags: ['data', 'analysis', 'visualization', 'csv'],
          author: 'DataFlow Pro',
          downloads: 890,
          rating: 4.6,
          reviews: 67,
          featured: true,
          premium: true,
          difficulty: 'intermediate',
          estimatedTime: '15 minutes',
          workflow_data: {
            nodes: [
              { id: 'upload', type: 'file_input', data: { label: 'CSV Upload' } },
              { id: 'analyze', type: 'data_processor', data: { label: 'Data Analysis' } },
              { id: 'visualize', type: 'chart_generator', data: { label: 'Create Charts' } },
              { id: 'report', type: 'output', data: { label: 'Analysis Report' } }
            ],
            connections: [
              { source: 'upload', target: 'analyze' },
              { source: 'analyze', target: 'visualize' },
              { source: 'visualize', target: 'report' }
            ]
          },
          created_at: '2024-01-10T08:00:00Z',
          updated_at: '2024-01-18T12:00:00Z'
        },
        {
          id: '3',
          name: 'Social Media Automation',
          description: 'Create and schedule social media posts across multiple platforms',
          category: 'automation',
          tags: ['social media', 'automation', 'scheduling', 'marketing'],
          author: 'SocialBot',
          downloads: 2100,
          rating: 4.9,
          reviews: 156,
          featured: false,
          premium: false,
          difficulty: 'beginner',
          estimatedTime: '10 minutes',
          workflow_data: {
            nodes: [
              { id: 'content', type: 'input', data: { label: 'Content Input' } },
              { id: 'generate', type: 'ai_model', data: { label: 'Generate Posts' } },
              { id: 'schedule', type: 'scheduler', data: { label: 'Schedule Posts' } },
              { id: 'publish', type: 'social_publisher', data: { label: 'Publish' } }
            ],
            connections: [
              { source: 'content', target: 'generate' },
              { source: 'generate', target: 'schedule' },
              { source: 'schedule', target: 'publish' }
            ]
          },
          created_at: '2024-01-05T14:00:00Z',
          updated_at: '2024-01-22T09:15:00Z'
        },
        {
          id: '4',
          name: 'Image Generation Studio',
          description: 'Generate, edit, and optimize images using DALL-E and Stable Diffusion',
          category: 'creative',
          tags: ['image', 'generation', 'dall-e', 'creative'],
          author: 'CreativeAI',
          downloads: 1680,
          rating: 4.7,
          reviews: 124,
          featured: true,
          premium: true,
          difficulty: 'intermediate',
          estimatedTime: '8 minutes',
          workflow_data: {
            nodes: [
              { id: 'prompt', type: 'input', data: { label: 'Image Prompt' } },
              { id: 'dalle', type: 'image_generator', data: { label: 'DALL-E 3' } },
              { id: 'enhance', type: 'image_processor', data: { label: 'Enhance' } },
              { id: 'output', type: 'output', data: { label: 'Final Image' } }
            ],
            connections: [
              { source: 'prompt', target: 'dalle' },
              { source: 'dalle', target: 'enhance' },
              { source: 'enhance', target: 'output' }
            ]
          },
          created_at: '2024-01-12T16:00:00Z',
          updated_at: '2024-01-19T11:45:00Z'
        },
        {
          id: '5',
          name: 'Research Assistant',
          description: 'Comprehensive research workflow with web scraping and summarization',
          category: 'research',
          tags: ['research', 'web scraping', 'summarization', 'analysis'],
          author: 'ResearchBot',
          downloads: 756,
          rating: 4.5,
          reviews: 43,
          featured: false,
          premium: false,
          difficulty: 'advanced',
          estimatedTime: '20 minutes',
          workflow_data: {
            nodes: [
              { id: 'query', type: 'input', data: { label: 'Research Query' } },
              { id: 'search', type: 'web_scraper', data: { label: 'Web Search' } },
              { id: 'analyze', type: 'ai_model', data: { label: 'Analyze Content' } },
              { id: 'summarize', type: 'ai_model', data: { label: 'Summarize' } },
              { id: 'report', type: 'output', data: { label: 'Research Report' } }
            ],
            connections: [
              { source: 'query', target: 'search' },
              { source: 'search', target: 'analyze' },
              { source: 'analyze', target: 'summarize' },
              { source: 'summarize', target: 'report' }
            ]
          },
          created_at: '2024-01-08T12:00:00Z',
          updated_at: '2024-01-16T14:30:00Z'
        }
      ];

      // Apply filters
      let filteredTemplates = mockTemplates.filter(template => {
        if (filters.search && !template.name.toLowerCase().includes(filters.search.toLowerCase()) &&
            !template.description.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        
        if (filters.category !== 'all' && template.category !== filters.category) {
          return false;
        }
        
        if (filters.difficulty !== 'all' && template.difficulty !== filters.difficulty) {
          return false;
        }
        
        if (filters.featured && !template.featured) {
          return false;
        }
        
        if (filters.premium && !template.premium) {
          return false;
        }
        
        return true;
      });

      // Apply sorting
      filteredTemplates.sort((a, b) => {
        switch (filters.sortBy) {
          case 'popular':
            return b.downloads - a.downloads;
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'rating':
            return b.rating - a.rating;
          case 'downloads':
            return b.downloads - a.downloads;
          default:
            return 0;
        }
      });

      setTemplates(filteredTemplates);
      
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseTemplate = async (template: WorkflowTemplate) => {
    try {
      await createWorkflow({
        name: `${template.name} (Copy)`,
        description: template.description,
        category: template.category,
        tags: template.tags,
        workflow_data: template.workflow_data,
        template_id: template.id
      });
      
      // Show success message or redirect
      console.log('Template applied successfully');
      
    } catch (error) {
      console.error('Failed to use template:', error);
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
      case 'research':
        return <Globe className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <h2 className="text-2xl font-bold text-foreground">Workflow Templates</h2>
          <p className="text-muted-foreground">
            Discover and use pre-built workflows to accelerate your projects
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share Template
          </Button>
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            Create Template
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
                  placeholder="Search templates..."
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
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.difficulty}
                onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
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
                  <SelectItem value="downloads">Downloads</SelectItem>
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
                checked={filters.premium}
                onChange={(e) => setFilters(prev => ({ ...prev, premium: e.target.checked }))}
              />
              <span className="text-sm">Premium only</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(template.category)}
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-sm">by {template.author}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {template.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  {template.premium && <Sparkles className="w-4 h-4 text-purple-500" />}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {template.description}
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
                <Badge variant="outline">{template.category}</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {template.estimatedTime}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(template.rating)}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({template.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Download className="w-4 h-4" />
                  {template.downloads.toLocaleString()}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleUseTemplate(template)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowPreview(true);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={() => setFilters({
              search: '',
              category: 'all',
              difficulty: 'all',
              featured: false,
              premium: false,
              sortBy: 'popular'
            })}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Template Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedTemplate.category)}
                  {selectedTemplate.name}
                  {selectedTemplate.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  {selectedTemplate.premium && <Sparkles className="w-4 h-4 text-purple-500" />}
                </DialogTitle>
                <DialogDescription>
                  by {selectedTemplate.author} • {selectedTemplate.downloads.toLocaleString()} downloads
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                          {selectedTemplate.difficulty}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <Badge variant="outline">{selectedTemplate.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Time:</span>
                        <span>{selectedTemplate.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <div className="flex items-center gap-1">
                          {renderStars(selectedTemplate.rating)}
                          <span>({selectedTemplate.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Workflow Preview</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <Bot className="w-12 h-12 mx-auto mb-2" />
                      <p>Workflow visualization would be displayed here</p>
                      <p className="text-sm">
                        {selectedTemplate.workflow_data.nodes.length} nodes, {selectedTemplate.workflow_data.connections.length} connections
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      handleUseTemplate(selectedTemplate);
                      setShowPreview(false);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Use This Template
                  </Button>
                  <Button variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button variant="outline">
                    <Heart className="w-4 h-4" />
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
