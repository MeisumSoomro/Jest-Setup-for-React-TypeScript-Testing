import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, format } from 'date-fns';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'month';

    // Get date range
    const now = new Date();
    let startDate, endDate;
    switch (range) {
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    // Fetch overview data
    const [totalStudents, activeCourses, completedCourses, reviews] = await Promise.all([
      db.user.count(),
      db.course.count(),
      db.courseProgress.count({
        where: { completed: true }
      }),
      db.courseReview.findMany()
    ]);

    const completionRate = (completedCourses / activeCourses) * 100;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    // Fetch engagement data
    const activeUsers = await db.user.findMany({
      where: {
        updatedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        updatedAt: true
      }
    });

    const timeSpent = await db.moduleProgress.findMany({
      where: {
        updatedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        lastPosition: true,
        updatedAt: true
      }
    });

    // Format engagement data by day
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const dailyActiveUsers = days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      count: activeUsers.filter(user => 
        format(user.updatedAt, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length
    }));

    const timeSpentLearning = days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      minutes: timeSpent
        .filter(progress => 
          format(progress.updatedAt, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        )
        .reduce((acc, progress) => acc + (progress.lastPosition || 0), 0)
    }));

    // Fetch performance data
    const courseCompletions = await db.course.findMany({
      select: {
        title: true,
        _count: {
          select: {
            certificates: true
          }
        }
      }
    });

    const moduleScores = await db.exercise.findMany({
      where: {
        submissions: {
          some: {
            status: 'APPROVED'
          }
        }
      },
      select: {
        module: {
          select: {
            title: true
          }
        },
        submissions: {
          where: {
            status: 'APPROVED'
          },
          select: {
            content: true // Assuming content contains the score
          }
        }
      }
    });

    // Fetch revenue data
    const subscriptions = await db.subscription.findMany({
      where: {
        startDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        tier: true
      }
    });

    const monthlyRevenue = days.map(day => ({
      month: format(day, 'MMM yyyy'),
      amount: subscriptions
        .filter(sub => format(sub.startDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
        .reduce((acc, sub) => acc + sub.tier.price, 0)
    }));

    const revenueByProduct = await db.subscriptionTier.findMany({
      select: {
        name: true,
        price: true,
        subscriptions: {
          where: {
            startDate: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      }
    });

    return NextResponse.json({
      overview: {
        totalStudents,
        activeCourses,
        completionRate,
        averageRating
      },
      engagement: {
        dailyActiveUsers,
        timeSpentLearning
      },
      performance: {
        courseCompletions: courseCompletions.map(course => ({
          course: course.title,
          completions: course._count.certificates
        })),
        averageScores: moduleScores.map(module => ({
          module: module.module.title,
          score: module.submissions.reduce((acc, sub) => acc + Number(sub.content), 0) / module.submissions.length
        }))
      },
      revenue: {
        monthly: monthlyRevenue,
        byProduct: revenueByProduct.map(product => ({
          product: product.name,
          revenue: product.price * product.subscriptions.length
        }))
      }
    });
  } catch (error) {
    console.error('[ANALYTICS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 