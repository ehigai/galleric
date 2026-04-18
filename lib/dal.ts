/**
 * Data Access Layer (DAL)
 *
 * This module acts as the security boundary between server code and data.
 * Always call `verifySession()` at the top of any Server Action or Route
 * Handler that requires authentication before touching the database or
 * returning sensitive data.
 *
 * The result is memoised for the lifetime of a single request via React's
 * `cache()`, so it is safe to call multiple times without extra round-trips.
 */

import { cache } from "react";
import { auth } from "./auth";
import { headers } from "next/headers";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
};

export type Session = {
  user: SessionUser;
  sessionToken: string;
  expiresAt: Date;
};

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Returns the current session for the incoming request, or `null` if there
 * is no valid session (unauthenticated).
 *
 * Cached per-request so it can safely be called from multiple places.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image ?? null,
    },
    sessionToken: session.session.token,
    expiresAt: session.session.expiresAt,
  };
});

/**
 * Verifies that the caller is authenticated.
 *
 * Throws a `Response` with status 401 if there is no valid session so it can
 * be used safely inside Route Handlers:
 *
 * ```ts
 * // app/api/protected/route.ts
 * import { verifySession } from "@/lib/dal";
 *
 * export async function GET() {
 *   const { user } = await verifySession();
 *   // ... rest of handler
 * }
 * ```
 *
 * In Server Components / Server Actions you can also let the thrown `Response`
 * bubble up, or catch it and redirect to `/login`.
 *
 * @throws {Response} 401 Unauthorized when no valid session exists.
 */
export async function verifySession(): Promise<Session> {
  const session = await getSession();

  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return session;
}

/**
 * Returns the authenticated user, or `null` for unauthenticated visitors.
 *
 * Use this in Server Components where you want to render differently for
 * logged-in vs. guest users without hard-redirecting.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}
