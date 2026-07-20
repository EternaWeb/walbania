import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/AdminShell";
import { getAdminSessionFn } from "../lib/admin/auth";
import adminCss from "../admin.css?url";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const session = await getAdminSessionFn();
    if (!session.authenticated) throw redirect({ href: "/admin/login" });
    return session;
  },
  head: () => ({
    meta: [
      { title: "WonderAlbania Admin" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
