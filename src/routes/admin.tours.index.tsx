import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { AdminEmptyState, AdminPageHeader } from "../components/admin/AdminShell";
import { listAdminToursFn } from "../lib/tours/server";

export const Route = createFileRoute("/admin/tours/")({
  loader: () => listAdminToursFn(),
  component: AdminToursPage,
});

function AdminToursPage() {
  const tours = Route.useLoaderData();
  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Tours"
        description="Draft, translate, preview and publish tour packages."
        actions={
          <a className="admin-button is-primary" href="/admin/tours/new">
            <Plus size={17} /> New tour
          </a>
        }
      />
      {tours.length === 0 ? (
        <AdminEmptyState
          title="Create your first tour"
          description="The editor will guide you through both languages, media, itinerary, dates, reviews and SEO."
          action={
            <a className="admin-button is-primary" href="/admin/tours/new">
              <Plus size={17} /> New tour
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
                <th>Base price</th>
                <th>Languages</th>
                <th>Updated</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <div className="admin-table-title">
                      <strong>{tour.titleEn || "Untitled tour"}</strong>
                      <span>{tour.slugEn ? `/${tour.slugEn}` : "English slug missing"}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-status is-${tour.status}`}>
                      {tour.featured && tour.status === "published" ? "featured" : tour.status}
                    </span>
                  </td>
                  <td>€{tour.basePriceEur.toFixed(2)}</td>
                  <td>{tour.titleEn && tour.titleFr ? "EN · FR" : "Incomplete"}</td>
                  <td>{new Date(tour.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-table-actions">
                      {tour.status === "published" && tour.slugEn && (
                        <a
                          className="admin-icon-button"
                          href={`/${tour.slugEn}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open published tour"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <a
                        className="admin-icon-button"
                        href={`/admin/tours/${tour.id}`}
                        aria-label="Edit tour"
                      >
                        <Pencil size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
