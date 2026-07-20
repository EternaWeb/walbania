import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

const serverClientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
} as const;

export function createPublicSupabaseClient() {
  return createClient(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_PUBLISHABLE_KEY"),
    serverClientOptions,
  );
}

export function createAdminSupabaseClient() {
  return createClient(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_SECRET_KEY"),
    serverClientOptions,
  );
}

export function readPublicSupabaseConfig() {
  return {
    url: requiredEnv("SUPABASE_URL"),
    publishableKey: requiredEnv("SUPABASE_PUBLISHABLE_KEY"),
  };
}

export function getSiteUrl() {
  return (process.env.SITE_URL?.trim() || "https://wonderalbania.com").replace(/\/+$/, "");
}
