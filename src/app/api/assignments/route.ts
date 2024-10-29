import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createAssignmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  dueDate: z.string().transform(str => new Date(str)),
  totalPoints: z.number().min(1),
  courseId: z.string(),
  allowedFileTypes: z.array(z.string()),
  maxFileSize: z.number(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = createAssignmentSchema.parse(json);

    const assignment = await db.assignment.create({
      data: {
        ...body,
        course: {
          connect: { id: body.courseId }
        }
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('[ASSIGNMENTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return new NextResponse('Course ID required', { status: 400 });
    }

    const assignments = await db.assignment.findMany({
      where: { courseId },
      include: {
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                name: true
              }
            },
            files: true
          }
        }
      }
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('[ASSIGNMENTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 