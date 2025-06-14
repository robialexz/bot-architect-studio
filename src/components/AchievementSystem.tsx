
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  Award,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'workflow' | 'agent' | 'premium' | 'engagement';
  points: number;
  requirement: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'legendary';
}

interface AchievementSystemProps {
  userId?: string;
}

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'current' | 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-workflow',
    title: 'First Steps',
    description: 'Create your first workflow',
    icon: <Target className="h-5 w-5" />,
    category: 'workflow',
    points: 10,
    requirement: 1,
    rarity: 'common',
  },
  {
    id: 'workflow-master',
    title: 'Workflow Master',
    description: 'Create 10 workflows',
    icon: <Crown className="h-5 w-5" />,
    category: 'workflow',
    points: 100,
    requirement: 10,
    rarity: 'rare',
  },
  {
    id: 'agent-collector',
    title: 'Agent Collector',
    description: 'Use 5 different AI agents',
    icon: <Star className="h-5 w-5" />,
    category: 'agent',
    points: 50,
    requirement: 5,
    rarity: 'common',
  },
  {
    id: 'premium-user',
    title: 'Premium Explorer',
    description: 'Upgrade to premium plan',
    icon: <Crown className="h-5 w-5" />,
    category: 'premium',
    points: 200,
    requirement: 1,
    rarity: 'legendary',
  },
];

const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-500';
    case 'rare':
      return 'bg-blue-500';
    case 'legendary':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getRarityLabel = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return 'Common';
    case 'rare':
      return 'Rare';
    case 'legendary':
      return 'Legendary';
    default:
      return 'Unknown';
  }
};

const AchievementSystem = ({ userId }: AchievementSystemProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Initialize achievements with mock data
    const mockProgress = {
      'first-workflow': { current: 1, unlocked: true, unlockedAt: '2024-01-15' },
      'workflow-master': { current: 3, unlocked: false },
      'agent-collector': { current: 2, unlocked: false },
      'premium-user': { current: 0, unlocked: false },
    };

    const achievementsWithProgress = ACHIEVEMENT_DEFINITIONS.map(achievement => ({
      ...achievement,
      current: mockProgress[achievement.id as keyof typeof mockProgress]?.current || 0,
      unlocked: mockProgress[achievement.id as keyof typeof mockProgress]?.unlocked || false,
      unlockedAt: mockProgress[achievement.id as keyof typeof mockProgress]?.unlockedAt,
    }));

    setAchievements(achievementsWithProgress);
    
    // Calculate total points
    const points = achievementsWithProgress
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
    setTotalPoints(points);
  }, []);

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievements
          </h2>
          <p className="text-muted-foreground">Track your progress and unlock rewards</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{totalPoints}</div>
          <div className="text-sm text-muted-foreground">Total Points</div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {unlockedCount} of {achievements.length} achievements unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <ScrollArea className="h-96">
            <div className="grid gap-4">
              {filteredAchievements.map((achievement) => (
                <Card 
                  key={achievement.id}
                  className={`transition-all ${
                    achievement.unlocked 
                      ? 'border-primary/50 bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.unlocked ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Lock className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={getRarityColor(achievement.rarity)}
                            >
                              {getRarityLabel(achievement.rarity)}
                            </Badge>
                            <Badge variant="outline">
                              {achievement.points} pts
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.current}/{achievement.requirement}</span>
                          </div>
                          <Progress 
                            value={(achievement.current / achievement.requirement) * 100} 
                            className="h-1"
                          />
                        </div>

                        {achievement.unlocked && achievement.unlockedAt && (
                          <div className="text-xs text-muted-foreground">
                            Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementSystem;
