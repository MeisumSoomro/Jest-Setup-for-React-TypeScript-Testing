import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, parentId } = await req.json();

    const folder = await db.contentItem.create({
      data: {
        name,
        type: 'FOLDER',
        parentId,
        ownerId: session.user.id
      }
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.error('[FOLDER_CREATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 