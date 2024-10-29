'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earnedAt?: Date;
}

interface Level {
  level: number;
  title: string;
  pointsRequired: number;
  benefits: string[];
}

interface Streak {
  current: number;
  longest: number;
  lastActive: Date;
}

interface GamificationProps {
  userId: string;
}

export function GamificationSystem({ userId }: GamificationProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData();
  }, [userId]);

  const fetchGamificationData = async () => {
    try {
      const [achievementsRes, pointsRes, streakRes] = await Promise.all([
        fetch(`/api/gamification/${userId}/achievements`),
        fetch(`/api/gamification/${userId}/points`),
        fetch(`/api/gamification/${userId}/streak`)
      ]);

      const [achievementsData, pointsData, streakData] = await Promise.all([
        achievementsRes.json(),
        pointsRes.json(),
        streakRes.json()
      ]);

      setAchievements(achievementsData);
      setCurrentPoints(pointsData.points);
      setCurrentLevel(pointsData.currentLevel);
      setNextLevel(pointsData.nextLevel);
      setStreak(streakData);
    } catch (error) {
      console.error('Failed to fetch gamification data:', error);
      toast.error('Failed to load gamification data');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressToNextLevel = () => {
    if (!currentLevel || !nextLevel) return 0;
    const pointsNeeded = nextLevel.pointsRequired - currentLevel.pointsRequired;
    const pointsGained = currentPoints - currentLevel.pointsRequired;
    return (pointsGained / pointsNeeded) * 100;
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">Level {currentLevel?.level}</h2>
            <p className="text-gray-500">{currentLevel?.title}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{currentPoints} Points</p>
            <p className="text-sm text-gray-500">
              {nextLevel && `${nextLevel.pointsRequired - currentPoints} points to next level`}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={getProgressToNextLevel()} />
          {currentLevel?.benefits.map((benefit, index) => (
            <p key={index} className="text-sm text-gray-600">
              • {benefit}
            </p>
          ))}
        </div>
      </Card>

      {/* Streak */}
      {streak && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Learning Streak</h3>
              <p className="text-gray-600">
                {streak.current} day{streak.current !== 1 ? 's' : ''} current •{' '}
                {streak.longest} day{streak.longest !== 1 ? 's' : ''} longest
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Achievements */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <Card
              key={achievement.id}
              className={`p-4 text-center ${
                achievement.earnedAt ? 'bg-green-50' : 'opacity-50'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-primary/10 rounded-full">
                  <img
                    src={achievement.icon}
                    alt={achievement.name}
                    className="w-8 h-8"
                  />
                </div>
                <h4 className="font-semibold">{achievement.name}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <Badge variant={achievement.earnedAt ? 'default' : 'outline'}>
                  {achievement.points} points
                </Badge>
                {achievement.earnedAt && (
                  <p className="text-xs text-gray-500">
                    Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Leaderboard</h3>
          <Badge>Top 10%</Badge>
        </div>
        <div className="space-y-4">
          {/* Add leaderboard entries here */}
        </div>
      </Card>
    </div>
  );
} 