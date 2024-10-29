import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return new NextResponse('Start and end dates required', { status: 400 });
    }

    const events = await db.calendarEvent.findMany({
      where: {
        userId: session.user.id,
        startDate: {
          gte: new Date(start),
          lte: new Date(end)
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('[CALENDAR_EVENTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const event = await db.calendarEvent.create({
      data: {
        ...json,
        userId: session.user.id
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('[CALENDAR_EVENTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 