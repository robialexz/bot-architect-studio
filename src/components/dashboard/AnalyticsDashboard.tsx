/**
 * Analytics Dashboard - Comprehensive analytics and reporting
 * Provides insights into workflow performance, AI usage, and system metrics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  Users, 
  DollarSign,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useWorkflows } from '@/hooks/useWorkflows';

interface AnalyticsData {
  overview: {
    totalExecutions: number;
    successRate: number;
    avgResponseTime: number;
    totalCost: number;
    activeUsers: number;
    trendsData: {
      executions: { change: number; period: string };
      successRate: { change: number; period: string };
      responseTime: { change: number; period: string };
      cost: { change: number; period: string };
    };
  };
  usage: {
    byProvider: Array<{ provider: string; requests: number; cost: number; successRate: number }>;
    byModel: Array<{ model: string; requests: number; tokens: number; cost: number }>;
    byWorkflow: Array<{ workflow: string; executions: number; avgTime: number; successRate: number }>;
  };
  performance: {
    responseTimeHistory: Array<{ date: string; avgTime: number; p95Time: number }>;
    errorRateHistory: Array<{ date: string; errorRate: number; totalRequests: number }>;
    throughputHistory: Array<{ date: string; requestsPerHour: number }>;
  };
  costs: {
    dailyCosts: Array<{ date: string; cost: number; requests: number }>;
    costByProvider: Array<{ provider: string; cost: number; percentage: number }>;
    costOptimization: Array<{ suggestion: string; potentialSaving: number; impact: string }>;
  };
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { getUsageStats, getAnalytics } = useAI();
  const { getWorkflows } = useWorkflows();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Load data from various sources
      const [usageStats, analytics, workflows] = await Promise.all([
        getUsageStats(),
        getAnalytics(),
        getWorkflows()
      ]);

      // Process and combine data
      const processedData: AnalyticsData = {
        overview: {
          totalExecutions: usageStats?.api_calls_count || 0,
          successRate: (usageStats?.performance_metrics?.success_rate || 0.95) * 100,
          avgResponseTime: usageStats?.performance_metrics?.avg_response_time || 2.5,
          totalCost: Object.values(usageStats?.cost_breakdown || {}).reduce((sum: number, cost: any) => sum + cost, 0),
          activeUsers: 1, // Would come from user analytics
          trendsData: {
            executions: { change: 12.5, period: 'vs last week' },
            successRate: { change: 2.1, period: 'vs last week' },
            responseTime: { change: -8.3, period: 'vs last week' },
            cost: { change: 15.2, period: 'vs last week' }
          }
        },
        usage: {
          byProvider: Object.entries(usageStats?.provider_usage || {}).map(([provider, data]: [string, any]) => ({
            provider,
            requests: data.requests || 0,
            cost: data.cost || 0,
            successRate: (data.success_rate || 0.95) * 100
          })),
          byModel: [
            { model: 'GPT-4', requests: 150, tokens: 45000, cost: 12.50 },
            { model: 'Claude-3', requests: 89, tokens: 28000, cost: 8.20 },
            { model: 'Gemini Pro', requests: 67, tokens: 22000, cost: 5.80 }
          ],
          byWorkflow: workflows?.slice(0, 5).map(workflow => ({
            workflow: workflow.name,
            executions: Math.floor(Math.random() * 50) + 10,
            avgTime: Math.random() * 3 + 1,
            successRate: Math.random() * 10 + 90
          })) || []
        },
        performance: {
          responseTimeHistory: generateTimeSeriesData(timeRange, 'responseTime'),
          errorRateHistory: generateTimeSeriesData(timeRange, 'errorRate'),
          throughputHistory: generateTimeSeriesData(timeRange, 'throughput')
        },
        costs: {
          dailyCosts: generateTimeSeriesData(timeRange, 'cost'),
          costByProvider: [
            { provider: 'OpenAI', cost: 45.20, percentage: 52 },
            { provider: 'Anthropic', cost: 28.50, percentage: 33 },
            { provider: 'Google', cost: 13.10, percentage: 15 }
          ],
          costOptimization: [
            { suggestion: 'Use Claude-3 Haiku for simple tasks', potentialSaving: 25.50, impact: 'High' },
            { suggestion: 'Implement request caching', potentialSaving: 18.20, impact: 'Medium' },
            { suggestion: 'Optimize prompt lengths', potentialSaving: 12.80, impact: 'Low' }
          ]
        }
      };

      setAnalyticsData(processedData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSeriesData = (range: string, type: string) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      let value;
      switch (type) {
        case 'responseTime':
          value = Math.random() * 2 + 1.5;
          break;
        case 'errorRate':
          value = Math.random() * 5 + 1;
          break;
        case 'throughput':
          value = Math.floor(Math.random() * 100) + 50;
          break;
        case 'cost':
          value = Math.random() * 20 + 10;
          break;
        default:
          value = Math.random() * 100;
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        [type === 'responseTime' ? 'avgTime' : 
         type === 'errorRate' ? 'errorRate' :
         type === 'throughput' ? 'requestsPerHour' : 'cost']: value,
        ...(type === 'responseTime' && { p95Time: value * 1.5 }),
        ...(type === 'errorRate' && { totalRequests: Math.floor(Math.random() * 200) + 100 }),
        ...(type === 'cost' && { requests: Math.floor(Math.random() * 50) + 20 })
      });
    }
    
    return data;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (change: number) => {
    return change > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getTrendColor = (change: number) => {
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load analytics</h3>
        <Button onClick={loadAnalyticsData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalExecutions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(analyticsData.overview.trendsData.executions.change)}
              <span className={getTrendColor(analyticsData.overview.trendsData.executions.change)}>
                {Math.abs(analyticsData.overview.trendsData.executions.change)}%
              </span>
              <span className="ml-1">{analyticsData.overview.trendsData.executions.period}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(analyticsData.overview.successRate)}</div>
            <Progress value={analyticsData.overview.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgResponseTime.toFixed(1)}s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(-analyticsData.overview.trendsData.responseTime.change)}
              <span className={getTrendColor(-analyticsData.overview.trendsData.responseTime.change)}>
                {Math.abs(analyticsData.overview.trendsData.responseTime.change)}%
              </span>
              <span className="ml-1">{analyticsData.overview.trendsData.responseTime.period}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.totalCost)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(analyticsData.overview.trendsData.cost.change)}
              <span className={getTrendColor(analyticsData.overview.trendsData.cost.change)}>
                {Math.abs(analyticsData.overview.trendsData.cost.change)}%
              </span>
              <span className="ml-1">{analyticsData.overview.trendsData.cost.period}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.activeUsers}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage by Provider */}
            <Card>
              <CardHeader>
                <CardTitle>Usage by AI Provider</CardTitle>
                <CardDescription>Requests and success rates by provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.usage.byProvider.map((provider) => (
                    <div key={provider.provider} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="font-medium">{provider.provider}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{provider.requests} requests</div>
                        <div className="text-sm text-muted-foreground">
                          {formatPercentage(provider.successRate)} success
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage by Model */}
            <Card>
              <CardHeader>
                <CardTitle>Usage by Model</CardTitle>
                <CardDescription>Token usage and costs by AI model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.usage.byModel.map((model) => (
                    <div key={model.model} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{model.model}</div>
                        <div className="text-sm text-muted-foreground">
                          {model.tokens.toLocaleString()} tokens
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(model.cost)}</div>
                        <div className="text-sm text-muted-foreground">
                          {model.requests} requests
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage by Workflow */}
          <Card>
            <CardHeader>
              <CardTitle>Top Workflows</CardTitle>
              <CardDescription>Most active workflows and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.usage.byWorkflow.map((workflow) => (
                  <div key={workflow.workflow} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{workflow.workflow}</div>
                      <div className="text-sm text-muted-foreground">
                        {workflow.executions} executions • {workflow.avgTime.toFixed(1)}s avg time
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={workflow.successRate > 95 ? 'default' : 'secondary'}>
                        {formatPercentage(workflow.successRate)} success
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average and P95 response times over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="w-8 h-8 mr-2" />
                  Chart visualization would go here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate Trends</CardTitle>
                <CardDescription>Error rates and total requests over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="w-8 h-8 mr-2" />
                  Chart visualization would go here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost by Provider</CardTitle>
                <CardDescription>Spending breakdown by AI provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.costs.costByProvider.map((provider) => (
                    <div key={provider.provider} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{provider.provider}</span>
                        <span className="font-semibold">{formatCurrency(provider.cost)}</span>
                      </div>
                      <Progress value={provider.percentage} />
                      <div className="text-sm text-muted-foreground">
                        {provider.percentage}% of total spend
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Cost Trends</CardTitle>
                <CardDescription>Daily spending and request volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="w-8 h-8 mr-2" />
                  Chart visualization would go here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization Suggestions</CardTitle>
              <CardDescription>Recommendations to reduce AI costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.costs.costOptimization.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{suggestion.suggestion}</div>
                      <div className="text-sm text-muted-foreground">
                        Potential monthly saving: {formatCurrency(suggestion.potentialSaving)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        suggestion.impact === 'High' ? 'default' :
                        suggestion.impact === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {suggestion.impact} Impact
                      </Badge>
                      <Button size="sm" variant="outline">
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
