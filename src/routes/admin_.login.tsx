import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import adminCss from "../admin.css?url";
import { getAdminSessionFn, loginAdminFn } from "../lib/admin/auth";

export const Route = createFileRoute("/admin_/login")({
  loader: async () => {
    const session = await getAdminSessionFn();
    if (session.authenticated) throw redirect({ href: "/admin" });
    return session;
  },
  head: () => ({
    meta: [
      { title: "Admin sign in | WonderAlbania" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  return (
    <main className="admin-login-page">
      <section className="admin-login-visual">
        <div>
          <img src="/weblogo.png" alt="WonderAlbania" />
          <h1>Your tours, ready for the world.</h1>
          <p>
            Manage bilingual tour pages, availability, itineraries, galleries and traveller
            stories from one private workspace.
          </p>
        </div>
      </section>
      <section className="admin-login-panel">
        <form
          className="admin-login-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");
            setSubmitting(true);
            try {
              const result = await loginAdminFn({ data: { password } });
              if (!result.ok) {
                setError(result.message);
                return;
              }
              window.location.assign("/admin");
            } catch {
              setError("Sign in is temporarily unavailable. Check the server configuration.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <span>Private workspace</span>
          <h2>Sign in</h2>
          <p>Enter the admin password configured for this website.</p>
          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              className="admin-input"
              type="password"
              value={password}
              autoComplete="current-password"
              autoFocus
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button className="admin-button is-primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Open admin panel"}
          </button>
          {error && (
            <div className="admin-form-error" role="alert">
              {error}
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
