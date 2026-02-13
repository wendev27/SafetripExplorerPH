// SECURITY: UploadThing router with strict file constraints.
// Only authenticated users can upload, and only image files are allowed.

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requireAdmin } from "@/lib/authz";
import { logApiError } from "@/lib/api-errors";

const f = createUploadthing();

export const uploadRouter = {
  // SECURITY: User avatar uploads - restricted to authenticated users
  avatar: f({
    image: {
      // SECURITY: Strict limits for avatar images
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // SECURITY: Log upload events for monitoring
      logApiError("uploadthing/avatar", {
        userId: metadata.userId,
        fileUrl: file.url,
        fileSize: file.size,
      });
    }),

  // SECURITY: Tourist spot images - restricted to admins only
  spotImage: f({
    image: {
      // SECURITY: Limit size and count to reduce abuse/DOS.
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);

      // SECURITY: Only admins can upload spot images
      const authResp = requireAdmin(session);
      if (authResp) {
        throw new UploadThingError("Unauthorized - Admin access required");
      }

      return { userId: session!.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // SECURITY: Log upload events for monitoring
      logApiError("uploadthing/spotImage", {
        userId: metadata.userId,
        fileUrl: file.url,
        fileSize: file.size,
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
