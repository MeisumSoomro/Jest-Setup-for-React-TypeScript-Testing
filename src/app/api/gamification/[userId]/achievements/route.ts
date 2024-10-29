import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const achievements = await db.userAchievement.findMany({
      where: {
        userId: params.userId
      },
      include: {
        achievement: true
      },
      orderBy: {
        earnedAt: 'desc'
      }
    });

    return NextResponse.json(achievements.map(ua => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      points: ua.achievement.points,
      earnedAt: ua.earnedAt
    })));
  } catch (error) {
    console.error('[ACHIEVEMENTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 