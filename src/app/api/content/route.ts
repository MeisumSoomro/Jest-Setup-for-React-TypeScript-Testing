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
    const folderId = searchParams.get('folder');

    const items = await db.contentItem.findMany({
      where: {
        parentId: folderId || null,
        ownerId: session.user.id
      },
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('[CONTENT_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 