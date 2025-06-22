/**
 * Team Collaboration - Complete collaboration system
 * Provides team management, permissions, comments, and real-time collaboration
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Share, 
  Settings, 
  Crown,
  Shield,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Reply,
  Heart,
  Flag,
  MoreHorizontal,
  Bell,
  Activity
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TeamMember {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joined_at: string;
  last_activity?: string;
  permissions: string[];
}

interface Comment {
  id: string;
  content: string;
  author: TeamMember;
  created_at: string;
  updated_at?: string;
  replies: Comment[];
  likes: number;
  is_resolved: boolean;
  workflow_id?: string;
  node_id?: string;
}

interface Activity {
  id: string;
  type: 'workflow_created' | 'workflow_updated' | 'comment_added' | 'member_added' | 'permission_changed';
  description: string;
  user: TeamMember;
  timestamp: string;
  metadata?: any;
}

export function TeamCollaboration({ workflowId }: { workflowId?: string }) {
  const [activeTab, setActiveTab] = useState('members');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');

  useEffect(() => {
    loadTeamData();
  }, [workflowId]);

  const loadTeamData = async () => {
    // Mock data - would come from API
    setTeamMembers([
      {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        role: 'owner',
        status: 'active',
        joined_at: '2024-01-15T10:00:00Z',
        last_activity: '2024-01-22T14:30:00Z',
        permissions: ['read', 'write', 'admin', 'delete']
      },
      {
        id: '2',
        username: 'jane_smith',
        email: 'jane@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        role: 'admin',
        status: 'active',
        joined_at: '2024-01-18T09:15:00Z',
        last_activity: '2024-01-21T16:45:00Z',
        permissions: ['read', 'write', 'admin']
      },
      {
        id: '3',
        username: 'bob_wilson',
        email: 'bob@example.com',
        role: 'editor',
        status: 'pending',
        joined_at: '2024-01-20T11:30:00Z',
        permissions: ['read', 'write']
      }
    ]);

    setComments([
      {
        id: '1',
        content: 'This workflow looks great! I think we should add error handling to the AI processing step.',
        author: teamMembers[1] || {} as TeamMember,
        created_at: '2024-01-22T10:30:00Z',
        replies: [
          {
            id: '2',
            content: 'Good point! I\'ll add that in the next iteration.',
            author: teamMembers[0] || {} as TeamMember,
            created_at: '2024-01-22T11:00:00Z',
            replies: [],
            likes: 2,
            is_resolved: false
          }
        ],
        likes: 5,
        is_resolved: false,
        workflow_id: workflowId
      }
    ]);

    setActivities([
      {
        id: '1',
        type: 'workflow_updated',
        description: 'Updated workflow configuration',
        user: teamMembers[0] || {} as TeamMember,
        timestamp: '2024-01-22T14:30:00Z'
      },
      {
        id: '2',
        type: 'comment_added',
        description: 'Added a comment on AI processing step',
        user: teamMembers[1] || {} as TeamMember,
        timestamp: '2024-01-22T10:30:00Z'
      }
    ]);
  };

  const handleInviteMember = async () => {
    try {
      // API call to invite member
      const newMember: TeamMember = {
        id: Date.now().toString(),
        username: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        joined_at: new Date().toISOString(),
        permissions: inviteRole === 'editor' ? ['read', 'write'] : ['read']
      };

      setTeamMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      setInviteRole('viewer');
      setShowInviteDialog(false);
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: teamMembers[0], // Current user
        created_at: new Date().toISOString(),
        replies: [],
        likes: 0,
        is_resolved: false,
        workflow_id: workflowId
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-green-500" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'editor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" />
            Team Collaboration
          </h2>
          <p className="text-muted-foreground">
            Manage team members, permissions, and collaborate on workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to collaborate on this workflow
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer - Can view workflows</SelectItem>
                      <SelectItem value="editor">Editor - Can edit workflows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteMember} disabled={!inviteEmail}>
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({teamMembers.length})</CardTitle>
              <CardDescription>
                Manage team members and their access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.username}</span>
                          {getStatusIcon(member.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                        {member.last_activity && (
                          <div className="text-xs text-muted-foreground">
                            Last active {formatDistanceToNow(new Date(member.last_activity), { addSuffix: true })}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {getRoleIcon(member.role)}
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                      </div>
                      
                      {member.role !== 'owner' && (
                        <Select
                          value={member.role}
                          onValueChange={(value) => {
                            setTeamMembers(prev => prev.map(m => 
                              m.id === member.id ? { ...m, role: value as any } : m
                            ));
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      
                      {member.role !== 'owner' && (
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comments & Discussions</CardTitle>
              <CardDescription>
                Collaborate and discuss workflow improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add Comment */}
              <div className="space-y-4 mb-6">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment or suggestion..."
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>
                          {comment.author.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{comment.author.username}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                          {comment.is_resolved && (
                            <Badge variant="outline" className="text-green-600">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-3">{comment.content}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <Heart className="w-4 h-4" />
                            {comment.likes}
                          </button>
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <Reply className="w-4 h-4" />
                            Reply
                          </button>
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <Flag className="w-4 h-4" />
                            Report
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={reply.author.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {reply.author.username?.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">{reply.author.username}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                    </span>
                                  </div>
                                  <p className="text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
              <CardDescription>
                Recent team activities and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Activity className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.user.username}</span>
                        <span className="text-sm text-muted-foreground">{activity.description}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
              <CardDescription>
                Configure detailed permissions for team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Permission Matrix */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Permission</th>
                        <th className="text-center p-2">Owner</th>
                        <th className="text-center p-2">Admin</th>
                        <th className="text-center p-2">Editor</th>
                        <th className="text-center p-2">Viewer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'View workflows', owner: true, admin: true, editor: true, viewer: true },
                        { name: 'Edit workflows', owner: true, admin: true, editor: true, viewer: false },
                        { name: 'Delete workflows', owner: true, admin: true, editor: false, viewer: false },
                        { name: 'Manage team', owner: true, admin: true, editor: false, viewer: false },
                        { name: 'Change permissions', owner: true, admin: false, editor: false, viewer: false },
                        { name: 'Add comments', owner: true, admin: true, editor: true, viewer: true },
                        { name: 'Execute workflows', owner: true, admin: true, editor: true, viewer: false }
                      ].map((permission, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-medium">{permission.name}</td>
                          <td className="text-center p-2">
                            {permission.owner ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : '—'}
                          </td>
                          <td className="text-center p-2">
                            {permission.admin ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : '—'}
                          </td>
                          <td className="text-center p-2">
                            {permission.editor ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : '—'}
                          </td>
                          <td className="text-center p-2">
                            {permission.viewer ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
