// Minimal signed-cookie session for a single hardcoded admin account.
//
// No auth library — a session cookie's value is just a fixed subject
// ("admin") plus an HMAC-SHA256 signature, so it can't be forged without
// the server's secret. There is no user database, no session store, and
// no support for multiple accounts — this is intentionally as small as
// possible for a single-admin app (see docs/DECISIONS.md).
//
// Uses the global Web Crypto API (`crypto.subtle`), available in both the
// Node.js runtime and the Edge runtime, so this file works unchanged in
// middleware and in Server Actions without any Node-specific imports.

export const SESSION_COOKIE_NAME = "farm_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const SESSION_SUBJECT = "admin";

function getSessionSecret(): string {
  // Falls back to a fixed dev-only value so the app works out of the box.
  // Set SESSION_SECRET in any real deployment — see docs/SETUP.md — so
  // sessions can't be forged by anyone who has read this source file.
  return process.env.SESSION_SECRET || "dev-only-insecure-session-secret-change-me";
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(getSessionSecret());
  return crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

/** Build a new signed session cookie value for the (only) admin account. */
export async function createSessionCookieValue(): Promise<string> {
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(SESSION_SUBJECT));
  return `${SESSION_SUBJECT}.${bufferToHex(signature)}`;
}

/** Verify a session cookie value's signature. Never throws. */
export async function isValidSessionCookieValue(raw: string | undefined | null): Promise<boolean> {
  if (!raw) return false;

  const [subject, signatureHex] = raw.split(".");
  if (!subject || !signatureHex || subject !== SESSION_SUBJECT) return false;

  try {
    const key = await getHmacKey();
    return await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBytes(signatureHex).buffer as ArrayBuffer,
      new TextEncoder().encode(subject),
    );
  } catch {
    return false;
  }
}
