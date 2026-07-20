import {
  getRequestHeader,
  getRequestIP,
  setResponseHeader,
  useSession,
} from "@tanstack/react-start/server";
import { createAdminSupabaseClient } from "../supabase";

const SESSION_NAME = "wa_admin";
const SESSION_MAX_AGE = 60 * 60 * 12;

type AdminSessionData = {
  admin?: boolean;
  authenticatedAt?: number;
};

const encoder = new TextEncoder();

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function safeEqual(left: string, right: string) {
  const [leftHash, rightHash] = await Promise.all([sha256(left), sha256(right)]);
  if (leftHash.length !== rightHash.length) return false;
  let difference = 0;
  for (let index = 0; index < leftHash.length; index += 1) {
    difference |= leftHash.charCodeAt(index) ^ rightHash.charCodeAt(index);
  }
  return difference === 0;
}

function readAuthEnvironment() {
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!password) throw new Error("ADMIN_PASSWORD is not configured.");
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  }
  return { password, sessionSecret };
}

async function getAdminSession() {
  const { password, sessionSecret } = readAuthEnvironment();
  const sealPassword = await sha256(`${sessionSecret}:${password}`);
  return useSession<AdminSessionData>({
    name: SESSION_NAME,
    password: sealPassword,
    maxAge: SESSION_MAX_AGE,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    },
  });
}

export function setAdminNoIndexHeaders() {
  setResponseHeader("Cache-Control", "private, no-store, max-age=0");
  setResponseHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  setResponseHeader("Vary", "Cookie");
}

async function requestFingerprint(secret: string) {
  const ip = getRequestIP({ xForwardedFor: true }) || "unknown";
  const forwarded = getRequestHeader("x-forwarded-for") || "";
  const userAgent = getRequestHeader("user-agent") || "";
  return sha256(`${secret}:${ip}:${forwarded.split(",")[0]}:${userAgent}`);
}

export async function requireAdminSession() {
  setAdminNoIndexHeaders();
  const session = await getAdminSession();
  if (session.data.admin !== true) throw new Error("UNAUTHORIZED");
  return true;
}

export async function readAdminSessionStatus() {
  setAdminNoIndexHeaders();
  try {
    const session = await getAdminSession();
    return { authenticated: session.data.admin === true };
  } catch {
    return { authenticated: false };
  }
}

export async function loginAdmin(passwordInput: string) {
  setAdminNoIndexHeaders();
  const { password, sessionSecret } = readAuthEnvironment();
  const fingerprint = await requestFingerprint(sessionSecret);
  const supabase = createAdminSupabaseClient();
  const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("admin_login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("fingerprint_hash", fingerprint)
    .gte("attempted_at", cutoff);
  if (countError) throw countError;
  if ((count ?? 0) >= 5) {
    return { ok: false, message: "Too many attempts. Try again in 15 minutes." };
  }

  const valid = await safeEqual(passwordInput, password);
  if (!valid) {
    const { error } = await supabase
      .from("admin_login_attempts")
      .insert({ fingerprint_hash: fingerprint });
    if (error) throw error;
    return { ok: false, message: "The password is not correct." };
  }

  await supabase.from("admin_login_attempts").delete().eq("fingerprint_hash", fingerprint);
  const session = await getAdminSession();
  await session.update({ admin: true, authenticatedAt: Date.now() });
  return { ok: true, message: "Signed in." };
}

export async function logoutAdmin() {
  setAdminNoIndexHeaders();
  const session = await getAdminSession();
  await session.clear();
  return { ok: true };
}

