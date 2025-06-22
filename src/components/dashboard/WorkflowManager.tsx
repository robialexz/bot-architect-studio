/**
 * Workflow Manager - Advanced workflow management interface
 * Provides CRUD operations, templates, and workflow organization
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Edit, 
  Copy, 
  Trash2, 
  Share, 
  Download,
  Upload,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Tag,
  Folder,
  Grid,
  List
} from 'lucide-react';
import { useWorkflows } from '@/hooks/useWorkflows';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowFilters {
  search: string;
  category: string;
  status: string;
  tags: string[];
  sortBy: 'name' | 'created_at' | 'updated_at' | 'executions';
  sortOrder: 'asc' | 'desc';
}

interface NewWorkflowData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  is_template: boolean;
  template_id?: string;
}

export function WorkflowManager() {
  const [filters, setFilters] = useState<WorkflowFilters>({
    search: '',
    category: 'all',
    status: 'all',
    tags: [],
    sortBy: 'updated_at',
    sortOrder: 'desc'
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);
  const [newWorkflowData, setNewWorkflowData] = useState<NewWorkflowData>({
    name: '',
    description: '',
    category: 'general',
    tags: [],
    is_template: false
  });

  const { 
    workflows, 
    getWorkflows, 
    createWorkflow, 
    updateWorkflow, 
    deleteWorkflow,
    duplicateWorkflow,
    getWorkflowTemplates 
  } = useWorkflows();

  useEffect(() => {
    loadWorkflows();
  }, [filters]);

  const loadWorkflows = async () => {
    try {
      await getWorkflows();
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  const filteredWorkflows = workflows?.filter(workflow => {
    // Search filter
    if (filters.search && !workflow.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !workflow.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && workflow.category !== filters.category) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'active' && !workflow.is_active) return false;
      if (filters.status === 'inactive' && workflow.is_active) return false;
      if (filters.status === 'template' && !workflow.is_template) return false;
    }
    
    // Tags filter
    if (filters.tags.length > 0) {
      const workflowTags = workflow.tags || [];
      if (!filters.tags.some(tag => workflowTags.includes(tag))) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    const aValue = a[filters.sortBy];
    const bValue = b[filters.sortBy];
    
    if (filters.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleCreateWorkflow = async () => {
    try {
      await createWorkflow({
        name: newWorkflowData.name,
        description: newWorkflowData.description,
        category: newWorkflowData.category,
        tags: newWorkflowData.tags,
        is_template: newWorkflowData.is_template,
        workflow_data: { nodes: [], connections: [] }
      });
      
      setShowNewWorkflowDialog(false);
      setNewWorkflowData({
        name: '',
        description: '',
        category: 'general',
        tags: [],
        is_template: false
      });
      
      loadWorkflows();
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const handleDuplicateWorkflow = async (workflowId: string) => {
    try {
      await duplicateWorkflow(workflowId);
      loadWorkflows();
    } catch (error) {
      console.error('Failed to duplicate workflow:', error);
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow(workflowId);
        loadWorkflows();
      } catch (error) {
        console.error('Failed to delete workflow:', error);
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedWorkflows.length === 0) return;
    
    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedWorkflows.length} workflows?`)) {
          for (const id of selectedWorkflows) {
            await deleteWorkflow(id);
          }
          setSelectedWorkflows([]);
          loadWorkflows();
        }
        break;
      case 'activate':
        for (const id of selectedWorkflows) {
          await updateWorkflow(id, { is_active: true });
        }
        setSelectedWorkflows([]);
        loadWorkflows();
        break;
      case 'deactivate':
        for (const id of selectedWorkflows) {
          await updateWorkflow(id, { is_active: false });
        }
        setSelectedWorkflows([]);
        loadWorkflows();
        break;
    }
  };

  const getStatusIcon = (workflow: any) => {
    if (workflow.is_template) {
      return <Star className="w-4 h-4 text-yellow-500" />;
    }
    if (workflow.is_active) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Pause className="w-4 h-4 text-gray-500" />;
  };

  const getStatusBadge = (workflow: any) => {
    if (workflow.is_template) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Template</Badge>;
    }
    if (workflow.is_active) {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    }
    return <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Workflow Manager</h2>
          <p className="text-muted-foreground">Create, organize, and manage your AI workflows</p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={showNewWorkflowDialog} onOpenChange={setShowNewWorkflowDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Set up a new AI workflow with custom configuration
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newWorkflowData.name}
                    onChange={(e) => setNewWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter workflow name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newWorkflowData.description}
                    onChange={(e) => setNewWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this workflow does"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newWorkflowData.category}
                    onValueChange={(value) => setNewWorkflowData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="content">Content Generation</SelectItem>
                      <SelectItem value="analysis">Data Analysis</SelectItem>
                      <SelectItem value="automation">Automation</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_template"
                    checked={newWorkflowData.is_template}
                    onChange={(e) => setNewWorkflowData(prev => ({ ...prev, is_template: e.target.checked }))}
                  />
                  <label htmlFor="is_template" className="text-sm font-medium">
                    Create as template
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewWorkflowDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateWorkflow} disabled={!newWorkflowData.name}>
                    Create Workflow
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search workflows..."
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
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="template">Templates</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedWorkflows.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedWorkflows.length} selected
              </span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                Activate
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('deactivate')}>
                Deactivate
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedWorkflows([])}>
                Clear Selection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflows Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredWorkflows?.map((workflow) => (
          <Card key={workflow.id} className={`${viewMode === 'list' ? 'flex items-center' : ''} hover:shadow-lg transition-shadow`}>
            <CardContent className={`${viewMode === 'list' ? 'flex items-center justify-between w-full p-4' : 'p-4'}`}>
              <div className={`${viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}`}>
                <div className={`${viewMode === 'list' ? 'flex items-center gap-2' : 'flex items-center justify-between mb-3'}`}>
                  <input
                    type="checkbox"
                    checked={selectedWorkflows.includes(workflow.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedWorkflows(prev => [...prev, workflow.id]);
                      } else {
                        setSelectedWorkflows(prev => prev.filter(id => id !== workflow.id));
                      }
                    }}
                    className="mr-2"
                  />
                  {getStatusIcon(workflow)}
                  {viewMode === 'grid' && getStatusBadge(workflow)}
                </div>

                <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="font-semibold text-lg">{workflow.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{workflow.description}</p>
                  
                  {viewMode === 'list' && (
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(workflow)}
                      <Badge variant="outline">{workflow.category}</Badge>
                    </div>
                  )}
                  
                  {viewMode === 'grid' && (
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline">{workflow.category}</Badge>
                      {workflow.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    Updated {formatDistanceToNow(new Date(workflow.updated_at), { addSuffix: true })}
                  </div>
                </div>
              </div>

              <div className={`${viewMode === 'list' ? 'flex items-center gap-2' : 'flex items-center justify-between mt-4'}`}>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDuplicateWorkflow(workflow.id)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteWorkflow(workflow.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.category !== 'all' || filters.status !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Create your first workflow to get started'
              }
            </p>
            <Button onClick={() => setShowNewWorkflowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
