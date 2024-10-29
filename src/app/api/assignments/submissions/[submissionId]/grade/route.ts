import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { submissionId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { submissionId } = params;
    const { grade, feedback } = await req.json();

    const submission = await db.submission.update({
      where: { id: submissionId },
      data: { grade, feedback }
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('[SUBMISSION_GRADE_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 