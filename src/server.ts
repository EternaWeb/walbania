import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

type PreferredLocale = "en" | "fr";

function readPreferredLocale(request: Request): PreferredLocale | null {
  const cookie = request.headers.get("cookie") ?? "";
  const savedLocale = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("wonderalbania_locale="))
    ?.split("=")[1];
  if (savedLocale === "en" || savedLocale === "fr") return savedLocale;

  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [language, quality] = part.trim().split(";q=");
      return { language: language.toLowerCase(), quality: Number(quality ?? "1") };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const item of accepted) {
    if (item.language.startsWith("fr")) return "fr";
    if (item.language.startsWith("en")) return "en";
  }
  return null;
}

function preferredLocaleRedirect(request: Request) {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  const locale = readPreferredLocale(request);
  const englishToFrench: Record<string, string> = {
    "/": "/fr/",
    "/tour": "/fr/tour",
  };
  const frenchToEnglish: Record<string, string> = {
    "/fr": "/",
    "/fr/": "/",
    "/fr/tour": "/tour",
  };

  const target =
    locale === "fr"
      ? englishToFrench[url.pathname]
      : locale === "en"
        ? frenchToEnglish[url.pathname]
        : undefined;
  if (!target) return null;

  url.pathname = target;
  return Response.redirect(url, 307);
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const localeRedirect = preferredLocaleRedirect(request);
      if (localeRedirect) return localeRedirect;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
