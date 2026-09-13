// Single hardcoded admin account for this single-admin application.
//
// IMPORTANT: only import this from server-side code (Server Actions,
// Route Handlers, middleware) — never from a "use client" component or
// anything that ships to the browser.
//
// To move these to environment variables later (recommended for any real
// deployment), set ADMIN_USERNAME and ADMIN_PASSWORD in your environment.
// They take priority automatically — no other code needs to change. The
// literals below only exist as a fallback so the app works out of the box
// per the current requirement to have this exact username/password built in.
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin@321";

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === getAdminUsername() && password === getAdminPassword();
}
