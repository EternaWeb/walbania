import {
  Compass,
  Images,
  Layers3,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  MapPinned,
  Settings2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { logoutAdminFn } from "../../lib/admin/auth";

const NAVIGATION = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/tours", label: "Tours", icon: Compass },
  { href: "/admin/collections", label: "Collections", icon: Layers3 },
  { href: "/admin/destinations", label: "Destinations", icon: MapPinned },
  { href: "/admin/attractions", label: "Attractions", icon: Landmark },
  { href: "/admin/media", label: "Media library", icon: Images },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
  { href: "/admin/taxonomies", label: "Categories & types", icon: Settings2 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  return (
    <div className="admin-app">
      <button
        type="button"
        className="admin-mobile-menu"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside className={`admin-sidebar${open ? " is-open" : ""}`}>
        <a className="admin-brand" href="/admin">
          <img src="/weblogo.png" alt="WonderAlbania" />
          <span>Tour administration</span>
        </a>
        <nav aria-label="Admin navigation">
          {NAVIGATION.map(({ href, label, icon: Icon, exact }) => {
            const current = exact ? pathname === href : pathname.startsWith(href);
            return (
              <a
                href={href}
                className={current ? "is-current" : ""}
                aria-current={current ? "page" : undefined}
                key={href}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </a>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer">
            Open website <span aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            onClick={async () => {
              await logoutAdminFn();
              window.location.assign("/admin/login");
            }}
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      {open && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <main className="admin-main">{children}</main>
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="admin-page-header">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="admin-page-actions">{actions}</div>}
    </header>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-empty">
      <Compass size={30} />
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
