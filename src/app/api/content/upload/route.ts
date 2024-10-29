import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { uploadthing } from '@/lib/uploadthing';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const folderId = formData.get('folderId') as string | null;

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const [res] = await uploadthing.upload({
          file,
          input: { userId: session.user.id }
        });

        const contentItem = await db.contentItem.create({
          data: {
            name: file.name,
            type: file.type.startsWith('image/') ? 'IMAGE' : 
                  file.type.startsWith('video/') ? 'VIDEO' : 'FILE',
            size: file.size,
            url: res.url,
            thumbnail: res.thumbnail,
            parentId: folderId,
            ownerId: session.user.id
          }
        });

        return contentItem;
      })
    );

    return NextResponse.json(uploadedFiles);
  } catch (error) {
    console.error('[UPLOAD_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 