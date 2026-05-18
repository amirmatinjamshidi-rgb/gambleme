import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "gambleme_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set in .env.local (at least 32 characters)",
    );
  }
  return secret;
}

function sign(sessionId: string): string {
  return createHmac("sha256", getSecret()).update(sessionId).digest("hex");
}

function pack(sessionId: string): string {
  return `${sessionId}.${sign(sessionId)}`;
}

function unpack(value: string): string | null {
  const dot = value.lastIndexOf(".");
  if (dot === -1) return null;

  const sessionId = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  if (!sessionId || !signature) return null;

  const expected = sign(sessionId);
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  return sessionId;
}

export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;

  if (existing) {
    const sessionId = unpack(existing);
    if (sessionId) return sessionId;
  }

  const sessionId = randomUUID();
  cookieStore.set(COOKIE_NAME, pack(sessionId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return sessionId;
}
