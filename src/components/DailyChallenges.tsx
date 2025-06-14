
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  Trophy,
  Target,
  CheckCircle,
  Flame,
  Gift,
  Star,
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: {
    points: number;
    badge?: string;
    tokens?: number;
  };
  progress: {
    current: number;
    target: number;
  };
  completed: boolean;
  expiresAt: string;
  category: 'workflow' | 'learning' | 'social' | 'creativity';
}

interface DailyChallengesProps {
  challenges: Challenge[];
  userStats: {
    streak: number;
    totalCompleted: number;
    weeklyProgress: number;
  };
  onStartChallenge: (challengeId: string) => void;
  onClaimReward: (challengeId: string) => void;
}

const DailyChallenges = ({ challenges, userStats, onStartChallenge, onClaimReward }: DailyChallengesProps) => {
  const [selectedType, setSelectedType] = useState<'all' | Challenge['type']>('all');

  const filteredChallenges = challenges.filter(
    challenge => selectedType === 'all' || challenge.type === selectedType
  );

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: Challenge['category']) => {
    switch (category) {
      case 'workflow': return <Target className="h-4 w-4" />;
      case 'learning': return <Trophy className="h-4 w-4" />;
      case 'social': return <Star className="h-4 w-4" />;
      case 'creativity': return <Gift className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daily Challenges</h2>
          <p className="text-muted-foreground">Complete challenges to earn rewards and maintain your streak</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-lg">{userStats.streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{userStats.totalCompleted}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={userStats.weeklyProgress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {userStats.weeklyProgress}% complete this week
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'daily', 'weekly', 'special'] as const).map((type) => (
          <Badge
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`transition-all duration-300 ${
              challenge.completed 
                ? 'border-green-500/50 bg-green-50/50' 
                : 'hover:shadow-lg'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(challenge.category)}
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                {challenge.completed && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <CardTitle className="text-base">{challenge.title}</CardTitle>
              <CardDescription className="text-sm">
                {challenge.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {challenge.progress.current} / {challenge.progress.target}
                  </span>
                </div>
                <Progress 
                  value={(challenge.progress.current / challenge.progress.target) * 100}
                  className="h-2"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{getTimeRemaining(challenge.expiresAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  <span className="font-medium">{challenge.reward.points} pts</span>
                </div>
              </div>

              <div className="flex gap-2">
                {challenge.completed ? (
                  <Button 
                    onClick={() => onClaimReward(challenge.id)}
                    className="w-full"
                    size="sm"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Claim Reward
                  </Button>
                ) : (
                  <Button 
                    onClick={() => onStartChallenge(challenge.id)}
                    className="w-full"
                    size="sm"
                    variant="outline"
                  >
                    Start Challenge
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyChallenges;
