import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, isValidSessionCookieValue } from "@/lib/auth/session";

/**
 * Gatekeeper for the whole app: every request (pages and API routes alike)
 * must have a valid signed session cookie, except the login page itself.
 * This is the single-admin app's entire access-control model — see
 * docs/DECISIONS.md for the "admin login" entry.
 *
 * Uses the `proxy` file convention (Next.js 16's replacement for the
 * deprecated `middleware` convention) — same request-interception
 * behavior, just the current name for it.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authenticated = await isValidSessionCookieValue(sessionCookie);

  if (pathname === "/login") {
    // Already signed in? Don't show the login form again.
    if (authenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
