import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const contentItem = await db.contentItem.findUnique({
      where: { id: params.id }
    });

    if (!contentItem) {
      return new NextResponse('Not found', { status: 404 });
    }

    if (contentItem.ownerId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await db.contentItem.delete({
      where: { id: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CONTENT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 