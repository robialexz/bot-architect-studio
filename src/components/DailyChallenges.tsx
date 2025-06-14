
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Target, 
  Trophy, 
  Zap, 
  CheckCircle2,
  XCircle,
  Timer,
  Star,
  Gift
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'workflow' | 'agent' | 'creativity' | 'efficiency';
  points: number;
  timeLimit: number; // in hours
  requirements: string[];
  reward: {
    points: number;
    badge?: string;
    bonus?: string;
  };
  status: 'available' | 'in-progress' | 'completed' | 'expired';
  progress: number;
  maxProgress: number;
  startedAt?: string;
  completedAt?: string;
  expiresAt: string;
}

interface DailyChallengesProps {
  userId?: string;
}

const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: 'daily-workflow-1',
    title: 'Workflow Speedrun',
    description: 'Create and run a complete workflow in under 10 minutes',
    difficulty: 'medium',
    category: 'efficiency',
    points: 50,
    timeLimit: 24,
    requirements: ['Create workflow', 'Add 3+ agents', 'Execute successfully'],
    reward: {
      points: 50,
      badge: 'Speed Demon',
      bonus: '2x XP for next workflow',
    },
    status: 'available',
    progress: 0,
    maxProgress: 3,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'daily-agent-2',
    title: 'Agent Explorer',
    description: 'Try 5 different AI agents in your workflows today',
    difficulty: 'easy',
    category: 'agent',
    points: 30,
    timeLimit: 24,
    requirements: ['Use 5 different agents', 'Test each agent', 'Rate experience'],
    reward: {
      points: 30,
      bonus: 'Unlock premium agent for 24h',
    },
    status: 'in-progress',
    progress: 2,
    maxProgress: 5,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'daily-creative-3',
    title: 'Creative Catalyst',
    description: 'Build a workflow that combines AI writing with image generation',
    difficulty: 'hard',
    category: 'creativity',
    points: 100,
    timeLimit: 24,
    requirements: ['Use text generation agent', 'Use image generation agent', 'Create combined output'],
    reward: {
      points: 100,
      badge: 'Creative Master',
      bonus: 'Featured workflow showcase',
    },
    status: 'available',
    progress: 0,
    maxProgress: 3,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
];

const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'hard':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getCategoryIcon = (category: Challenge['category']) => {
  switch (category) {
    case 'workflow':
      return <Target className="h-4 w-4" />;
    case 'agent':
      return <Zap className="h-4 w-4" />;
    case 'creativity':
      return <Star className="h-4 w-4" />;
    case 'efficiency':
      return <Timer className="h-4 w-4" />;
    default:
      return <Target className="h-4 w-4" />;
  }
};

const getTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
};

const DailyChallenges = ({ userId }: DailyChallengesProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>(SAMPLE_CHALLENGES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [totalPointsToday, setTotalPointsToday] = useState(0);

  useEffect(() => {
    // Calculate total points earned today
    const completedToday = challenges.filter(c => 
      c.status === 'completed' && 
      c.completedAt && 
      new Date(c.completedAt).toDateString() === new Date().toDateString()
    );
    const points = completedToday.reduce((sum, c) => sum + c.points, 0);
    setTotalPointsToday(points);
  }, [challenges]);

  const startChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, status: 'in-progress', startedAt: new Date().toISOString() }
        : c
    ));
  };

  const filteredChallenges = challenges.filter(challenge => 
    selectedCategory === 'all' || challenge.category === selectedCategory
  );

  const activeChallenges = challenges.filter(c => c.status === 'in-progress').length;
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-500" />
            Daily Challenges
          </h2>
          <p className="text-muted-foreground">Complete challenges to earn points and rewards</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-500">{totalPointsToday}</div>
          <div className="text-sm text-muted-foreground">Points Today</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-lg font-bold">{activeChallenges}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-lg font-bold">{completedChallenges}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-lg font-bold">{challenges.length}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          All Challenges
        </Button>
        {['workflow', 'agent', 'creativity', 'efficiency'].map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {getCategoryIcon(category as Challenge['category'])}
            <span className="ml-1">{category}</span>
          </Button>
        ))}
      </div>

      {/* Challenges List */}
      <ScrollArea className="h-96">
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className={`transition-all ${
              challenge.status === 'completed' ? 'border-green-500/50 bg-green-500/5' :
              challenge.status === 'in-progress' ? 'border-blue-500/50 bg-blue-500/5' :
              challenge.status === 'expired' ? 'border-red-500/50 bg-red-500/5' :
              'border-border'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getCategoryIcon(challenge.category)}
                      {challenge.title}
                      <Badge 
                        variant="secondary" 
                        className={getDifficultyColor(challenge.difficulty)}
                      >
                        {challenge.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      {challenge.points} pts
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getTimeRemaining(challenge.expiresAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Progress */}
                  {challenge.status === 'in-progress' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  {/* Requirements */}
                  <div>
                    <div className="text-sm font-medium mb-2">Requirements:</div>
                    <div className="space-y-1">
                      {challenge.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {challenge.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : challenge.status === 'in-progress' && index < challenge.progress ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                          )}
                          <span className={
                            challenge.status === 'completed' || 
                            (challenge.status === 'in-progress' && index < challenge.progress)
                              ? 'line-through text-muted-foreground' 
                              : ''
                          }>
                            {req}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Rewards */}
                  <div>
                    <div className="text-sm font-medium mb-2">Rewards:</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{challenge.reward.points} points</Badge>
                      {challenge.reward.badge && (
                        <Badge variant="outline">{challenge.reward.badge}</Badge>
                      )}
                      {challenge.reward.bonus && (
                        <Badge variant="outline">{challenge.reward.bonus}</Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="pt-2">
                    {challenge.status === 'available' && (
                      <Button 
                        onClick={() => startChallenge(challenge.id)}
                        className="w-full"
                      >
                        Start Challenge
                      </Button>
                    )}
                    {challenge.status === 'in-progress' && (
                      <Button variant="outline" className="w-full" disabled>
                        In Progress...
                      </Button>
                    )}
                    {challenge.status === 'completed' && (
                      <Button variant="outline" className="w-full" disabled>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed
                      </Button>
                    )}
                    {challenge.status === 'expired' && (
                      <Button variant="outline" className="w-full" disabled>
                        <XCircle className="mr-2 h-4 w-4" />
                        Expired
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DailyChallenges;
