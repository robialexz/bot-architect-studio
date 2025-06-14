
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Star,
  Target,
  CheckCircle,
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'workflow' | 'social' | 'learning' | 'milestone';
  requirements: {
    type: 'count' | 'streak' | 'completion';
    target: number;
    current: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface AchievementSystemProps {
  achievements: Achievement[];
  userStats: {
    totalPoints: number;
    level: number;
    nextLevelPoints: number;
  };
  onClaimReward?: (achievementId: string) => void;
}

const AchievementSystem = ({ achievements, userStats, onClaimReward }: AchievementSystemProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Achievement['category']>('all');

  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'workflow': return <Target className="h-4 w-4" />;
      case 'social': return <Star className="h-4 w-4" />;
      case 'learning': return <Trophy className="h-4 w-4" />;
      case 'milestone': return <CheckCircle className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Achievements</h2>
          <p className="text-muted-foreground">
            {unlockedAchievements.length} of {totalAchievements} achievements unlocked
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Level {userStats.level}</p>
          <p className="font-semibold">{userStats.totalPoints} points</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress to Next Level</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress 
            value={(userStats.totalPoints / userStats.nextLevelPoints) * 100} 
            className="w-full"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {userStats.nextLevelPoints - userStats.totalPoints} points until level {userStats.level + 1}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'workflow', 'social', 'learning', 'milestone'] as const).map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? (
              'All'
            ) : (
              <div className="flex items-center gap-1">
                {getCategoryIcon(category)}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
            )}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`relative transition-all duration-300 ${
              achievement.unlocked 
                ? 'border-primary/50 bg-primary/5' 
                : 'border-border hover:border-border/80'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`text-lg ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                    {achievement.icon}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getRarityColor(achievement.rarity)}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
                {achievement.unlocked && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <CardTitle className="text-base">{achievement.title}</CardTitle>
              <CardDescription className="text-sm">
                {achievement.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {achievement.requirements.current} / {achievement.requirements.target}
                  </span>
                </div>
                <Progress 
                  value={(achievement.requirements.current / achievement.requirements.target) * 100}
                  className="h-2"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{achievement.points} points</span>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="text-xs text-muted-foreground">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AchievementSystem;
