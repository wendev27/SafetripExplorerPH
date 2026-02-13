// SECURITY: Centralized RBAC helpers so all API routes
// enforce authentication and roles in a consistent way.

import { NextResponse } from "next/server";
import type { Session } from "next-auth";

type AppRole = "user" | "admin" | "superadmin";

/**
 * SECURITY: Ensure a user is authenticated. Returns a NextResponse
 * if unauthorized, otherwise null so callers can early-return.
 */
export function ensureAuthenticated(session: Session | null) {
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  return null;
}

/**
 * SECURITY: Ensure the current user has one of the allowed roles,
 * based on the server-side session (never trust client role claims).
 */
export function ensureRole(session: Session | null, allowedRoles: AppRole[]) {
  const base = ensureAuthenticated(session);
  if (base) return base;

  const role = (session!.user as any).userRole as AppRole | undefined;

  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  return null;
}

/**
 * SECURITY: Convenience wrapper for requiring user role.
 */
export function requireUser(session: Session | null) {
  return ensureRole(session, ["user"]);
}

/**
 * SECURITY: Convenience wrapper for requiring admin role.
 */
export function requireAdmin(session: Session | null) {
  return ensureRole(session, ["admin"]);
}

/**
 * SECURITY: Convenience wrapper for requiring superadmin role.
 */
export function requireSuperAdmin(session: Session | null) {
  return ensureRole(session, ["superadmin"]);
}

/**
 * SECURITY: Convenience wrapper for requiring admin or superadmin role.
 */
export function requireAdminOrSuperAdmin(session: Session | null) {
  return ensureRole(session, ["admin", "superadmin"]);
}
