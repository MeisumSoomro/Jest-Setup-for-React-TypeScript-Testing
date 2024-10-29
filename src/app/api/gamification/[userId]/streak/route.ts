import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { isToday, subDays } from 'date-fns';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's activity log
    const activityLog = await db.moduleProgress.findMany({
      where: {
        userId: params.userId
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date();
    let streakBroken = false;

    while (!streakBroken) {
      const hasActivity = activityLog.some(log => 
        isToday(new Date(log.updatedAt))
      );

      if (hasActivity) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        streakBroken = true;
      }
    }

    // Calculate longest streak (from historical data)
    const longestStreak = await db.userStreak.findFirst({
      where: {
        userId: params.userId
      },
      select: {
        longestStreak: true
      }
    });

    return NextResponse.json({
      current: currentStreak,
      longest: longestStreak?.longestStreak || currentStreak,
      lastActive: activityLog[0]?.updatedAt || new Date()
    });
  } catch (error) {
    console.error('[STREAK_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 