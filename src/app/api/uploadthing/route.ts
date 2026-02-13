// SECURITY: Route handler for UploadThing using the hardened router in core.ts.

import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});

