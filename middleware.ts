// SECURITY: Global middleware for security headers, CSRF protection, and authentication enforcement.

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// SECURITY: Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/auth/login",
  "/signup",
  "/auth/register",
  "/api/auth",
  "/api/shared",
  "/api/reviews",
  "/extra/contact",
  "/extra/about",
];

// SECURITY: Check if route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // SECURITY: Authentication enforcement
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && !isPublicRoute(pathname)) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // SECURITY: Apply security headers and CSRF protection only for authenticated users
  const response = NextResponse.next();

  // SECURITY: Standard hardening headers.
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );

  // SECURITY: CSRF protection for custom API routes.
  const method = request.method.toUpperCase();
  const isMutatingMethod =
    method === "POST" ||
    method === "PUT" ||
    method === "PATCH" ||
    method === "DELETE";

  const isApiRoute = pathname.startsWith("/api");
  const isNextAuthRoute = pathname.startsWith("/api/auth");

  if (isApiRoute && !isNextAuthRoute && isMutatingMethod) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const requestOrigin = origin ?? (referer ? new URL(referer).origin : null);
    const appOrigin = request.nextUrl.origin;

    // If we have an origin and it doesn't match our own, reject.
    if (requestOrigin && requestOrigin !== appOrigin) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid CSRF token" }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }

  return response;
}

export const config = {
  // SECURITY: Apply to all routes except static files and Next.js internals
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
