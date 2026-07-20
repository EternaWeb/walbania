import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Languages, Plus } from "lucide-react";
import { AdminEmptyState, AdminPageHeader } from "../components/admin/AdminShell";
import { listAdminToursFn } from "../lib/tours/server";

export const Route = createFileRoute("/admin/")({
  loader: () => listAdminToursFn(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const tours = Route.useLoaderData();
  const published = tours.filter((tour) => tour.status === "published").length;
  const drafts = tours.filter((tour) => tour.status === "draft").length;
  const incomplete = tours.filter(
    (tour) => !tour.titleEn || !tour.titleFr || !tour.slugEn || !tour.slugFr,
  ).length;
  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title="Good to see you."
        description="Create and publish complete English and French tour pages from one workspace."
        actions={
          <a className="admin-button is-primary" href="/admin/tours/new">
            <Plus size={17} /> New tour
          </a>
        }
      />
      <section className="admin-kpi-grid" aria-label="Tour statistics">
        <article className="admin-kpi">
          <span>All tours</span>
          <strong>{tours.length}</strong>
        </article>
        <article className="admin-kpi">
          <span>Published</span>
          <strong>{published}</strong>
        </article>
        <article className="admin-kpi">
          <span>Drafts</span>
          <strong>{drafts}</strong>
        </article>
        <article className="admin-kpi">
          <span>Needs translation</span>
          <strong>{incomplete}</strong>
        </article>
      </section>
      <section className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Recently updated</h2>
            <a href="/admin/tours">View all</a>
          </div>
          {tours.length === 0 ? (
            <AdminEmptyState
              title="No tours yet"
              description="Create your first bilingual tour and publish it when every section is ready."
              action={
                <a className="admin-button is-primary" href="/admin/tours/new">
                  Create tour
                </a>
              }
            />
          ) : (
            <div className="admin-table-shell">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tour</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {tours.slice(0, 5).map((tour) => (
                    <tr key={tour.id}>
                      <td>
                        <div className="admin-table-title">
                          <strong>{tour.titleEn || "Untitled tour"}</strong>
                          <span>{tour.titleFr || "French title missing"}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-status is-${tour.status}`}>{tour.status}</span>
                      </td>
                      <td>{new Date(tour.updatedAt).toLocaleDateString()}</td>
                      <td>
                        <a className="admin-icon-button" href={`/admin/tours/${tour.id}`}>
                          <ArrowRight size={16} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <aside className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Publishing checklist</h2>
          </div>
          <div className="admin-notice">
            <Languages size={18} />
            <p>English and French content must both be complete before publishing.</p>
          </div>
          <div className="admin-notice" style={{ marginTop: 10 }}>
            <CalendarDays size={18} />
            <p>All future dates use the base price unless you create an exception.</p>
          </div>
        </aside>
      </section>
    </>
  );
}

