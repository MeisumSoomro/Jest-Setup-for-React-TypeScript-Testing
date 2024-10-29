import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
  assignmentFile: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const session = await auth();
      if (!session) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 