import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isFrench = pathname === "/fr" || pathname.startsWith("/fr/");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isFrench ? "Page introuvable." : "Page not found."}
        </p>
        <a
          href={isFrench ? "/fr/" : "/"}
          className="mt-6 inline-block btn-brand"
          style={{ background: "#1F2528", color: "white" }}
        >
          {isFrench ? "Retour à l’accueil" : "Go home"}
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isFrench = pathname === "/fr" || pathname.startsWith("/fr/");
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">
          {isFrench ? "Cette page ne s’est pas chargée" : "This page didn't load"}
        </h1>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-4 btn-brand"
          style={{ background: "#1F2528", color: "white" }}
        >
          {isFrench ? "Réessayer" : "Try again"}
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicons/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicons/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", href: "/favicons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/favicons/apple-touch-icon.png", sizes: "180x180" },
      {
        rel: "icon",
        href: "/favicons/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        rel: "icon",
        href: "/favicons/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const locale = pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
