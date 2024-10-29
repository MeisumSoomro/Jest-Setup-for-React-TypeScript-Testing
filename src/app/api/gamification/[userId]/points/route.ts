import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const LEVELS = [
  { level: 1, title: 'Beginner', pointsRequired: 0, benefits: ['Access to basic courses'] },
  { level: 2, title: 'Intermediate', pointsRequired: 100, benefits: ['Access to intermediate courses', '5% discount'] },
  { level: 3, title: 'Advanced', pointsRequired: 300, benefits: ['Access to advanced courses', '10% discount'] },
  { level: 4, title: 'Expert', pointsRequired: 1000, benefits: ['Access to expert courses', '15% discount', 'Priority support'] },
  { level: 5, title: 'Master', pointsRequired: 3000, benefits: ['Access to all content', '20% discount', 'VIP support'] }
];

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Calculate total points from achievements
    const userAchievements = await db.userAchievement.findMany({
      where: {
        userId: params.userId
      },
      include: {
        achievement: true
      }
    });

    const totalPoints = userAchievements.reduce(
      (sum, ua) => sum + ua.achievement.points,
      0
    );

    // Determine current level and next level
    const currentLevel = LEVELS.reduce((prev, curr) => 
      totalPoints >= curr.pointsRequired ? curr : prev
    );

    const nextLevel = LEVELS.find(level => 
      level.pointsRequired > totalPoints
    ) || null;

    return NextResponse.json({
      points: totalPoints,
      currentLevel,
      nextLevel
    });
  } catch (error) {
    console.error('[POINTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 