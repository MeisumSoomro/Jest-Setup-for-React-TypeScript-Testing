import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleAsync } from '@/lib/utils/error-handler';

export async function GET(
  request: Request,
  { params }: { params: { studentId: string; courseId: string } }
) {
  const [error, progress] = await handleAsync(
    prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: params.studentId,
          courseId: params.courseId,
        },
      },
    })
  );

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }

  return NextResponse.json({ progress });
} 