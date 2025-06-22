/**
 * Workflow Sharing - Share workflows with team members and manage permissions
 * Provides collaboration features for workflow development
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Share, 
  Users, 
  Copy, 
  Mail, 
  Link, 
  Eye, 
  Edit, 
  Trash2,
  Crown,
  Shield,
  UserPlus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Settings
} from 'lucide-react';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useIntegratedAuth } from '@/hooks/useIntegratedAuth';
import { formatDistanceToNow } from 'date-fns';

interface SharedWorkflow {
  id: string;
  workflow_id: string;
  workflow_name: string;
  shared_by: string;
  shared_with: string;
  permission: 'view' | 'edit' | 'admin';
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  expires_at?: string;
}

interface WorkflowCollaborator {
  id: string;
  user_id: string;
  username: string;
  email: string;
  avatar?: string;
  permission: 'view' | 'edit' | 'admin';
  status: 'active' | 'pending' | 'inactive';
  joined_at: string;
  last_activity?: string;
}

interface ShareSettings {
  visibility: 'private' | 'team' | 'public';
  allow_comments: boolean;
  allow_forks: boolean;
  require_approval: boolean;
  expires_at?: string;
}

export function WorkflowSharing({ workflowId }: { workflowId: string }) {
  const [collaborators, setCollaborators] = useState<WorkflowCollaborator[]>([]);
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    visibility: 'private',
    allow_comments: true,
    allow_forks: false,
    require_approval: true
  });
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState<'view' | 'edit' | 'admin'>('view');
  const [shareMessage, setShareMessage] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useIntegratedAuth();

  useEffect(() => {
    loadCollaborators();
    generateShareLink();
  }, [workflowId]);

  const loadCollaborators = async () => {
    try {
      setIsLoading(true);
      
      // Mock collaborators data - would come from API
      const mockCollaborators: WorkflowCollaborator[] = [
        {
          id: '1',
          user_id: 'user1',
          username: 'john_doe',
          email: 'john@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
          permission: 'admin',
          status: 'active',
          joined_at: '2024-01-15T10:00:00Z',
          last_activity: '2024-01-22T14:30:00Z'
        },
        {
          id: '2',
          user_id: 'user2',
          username: 'jane_smith',
          email: 'jane@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
          permission: 'edit',
          status: 'active',
          joined_at: '2024-01-18T09:15:00Z',
          last_activity: '2024-01-21T16:45:00Z'
        },
        {
          id: '3',
          user_id: 'user3',
          username: 'bob_wilson',
          email: 'bob@example.com',
          permission: 'view',
          status: 'pending',
          joined_at: '2024-01-20T11:30:00Z'
        }
      ];

      setCollaborators(mockCollaborators);
      
    } catch (error) {
      console.error('Failed to load collaborators:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/workflows/shared/${workflowId}?token=${btoa(workflowId + Date.now())}`;
    setShareLink(link);
  };

  const handleShareWorkflow = async () => {
    try {
      // API call to share workflow
      const shareData = {
        workflow_id: workflowId,
        email: shareEmail,
        permission: sharePermission,
        message: shareMessage
      };

      console.log('Sharing workflow:', shareData);
      
      // Add to collaborators list
      const newCollaborator: WorkflowCollaborator = {
        id: Date.now().toString(),
        user_id: 'new_user',
        username: shareEmail.split('@')[0],
        email: shareEmail,
        permission: sharePermission,
        status: 'pending',
        joined_at: new Date().toISOString()
      };

      setCollaborators(prev => [...prev, newCollaborator]);
      
      // Reset form
      setShareEmail('');
      setSharePermission('view');
      setShareMessage('');
      setShowShareDialog(false);
      
    } catch (error) {
      console.error('Failed to share workflow:', error);
    }
  };

  const handleUpdatePermission = async (collaboratorId: string, newPermission: 'view' | 'edit' | 'admin') => {
    try {
      setCollaborators(prev => prev.map(collab => 
        collab.id === collaboratorId 
          ? { ...collab, permission: newPermission }
          : collab
      ));
    } catch (error) {
      console.error('Failed to update permission:', error);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (confirm('Are you sure you want to remove this collaborator?')) {
      try {
        setCollaborators(prev => prev.filter(collab => collab.id !== collaboratorId));
      } catch (error) {
        console.error('Failed to remove collaborator:', error);
      }
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    // Show toast notification
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'edit':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'view':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'edit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'view':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Workflow Sharing</h3>
          <p className="text-muted-foreground">Manage collaborators and sharing settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Collaborator
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Workflow</DialogTitle>
                <DialogDescription>
                  Invite someone to collaborate on this workflow
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Permission Level</label>
                  <Select value={sharePermission} onValueChange={(value: any) => setSharePermission(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="edit">Can Edit</SelectItem>
                      <SelectItem value="admin">Admin Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Message (Optional)</label>
                  <Textarea
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleShareWorkflow} disabled={!shareEmail}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Share Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Share Link
          </CardTitle>
          <CardDescription>
            Anyone with this link can access the workflow based on your settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input value={shareLink} readOnly className="flex-1" />
            <Button variant="outline" onClick={copyShareLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              {shareSettings.visibility === 'public' ? (
                <Globe className="w-4 h-4 text-green-500" />
              ) : (
                <Lock className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm font-medium">
                {shareSettings.visibility === 'public' ? 'Public' : 'Private'}
              </span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Collaborators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Collaborators ({collaborators.length})
          </CardTitle>
          <CardDescription>
            People who have access to this workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={collaborator.avatar} />
                    <AvatarFallback>
                      {collaborator.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{collaborator.username}</span>
                      {getStatusIcon(collaborator.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">{collaborator.email}</div>
                    {collaborator.last_activity && (
                      <div className="text-xs text-muted-foreground">
                        Last active {formatDistanceToNow(new Date(collaborator.last_activity), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {getPermissionIcon(collaborator.permission)}
                    <Badge className={getPermissionColor(collaborator.permission)}>
                      {collaborator.permission}
                    </Badge>
                  </div>
                  
                  {collaborator.status === 'active' && (
                    <Select
                      value={collaborator.permission}
                      onValueChange={(value: any) => handleUpdatePermission(collaborator.id, value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {collaborators.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No collaborators yet</p>
                <p className="text-sm">Invite team members to start collaborating</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sharing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Sharing Settings
          </CardTitle>
          <CardDescription>
            Configure how this workflow can be shared and accessed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Visibility</label>
              <Select
                value={shareSettings.visibility}
                onValueChange={(value: any) => setShareSettings(prev => ({ ...prev, visibility: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private - Only invited users</SelectItem>
                  <SelectItem value="team">Team - All team members</SelectItem>
                  <SelectItem value="public">Public - Anyone with link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shareSettings.allow_comments}
                  onChange={(e) => setShareSettings(prev => ({ ...prev, allow_comments: e.target.checked }))}
                />
                <span className="text-sm">Allow comments</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shareSettings.allow_forks}
                  onChange={(e) => setShareSettings(prev => ({ ...prev, allow_forks: e.target.checked }))}
                />
                <span className="text-sm">Allow forking</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shareSettings.require_approval}
                  onChange={(e) => setShareSettings(prev => ({ ...prev, require_approval: e.target.checked }))}
                />
                <span className="text-sm">Require approval for new collaborators</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
