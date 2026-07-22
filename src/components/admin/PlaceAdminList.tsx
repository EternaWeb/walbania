import { ExternalLink, Pencil, Plus } from "lucide-react";
import type { PlaceAdminListRow, PlaceKind } from "../../lib/places/types";
import { AdminEmptyState, AdminPageHeader } from "./AdminShell";

export function PlaceAdminList({ kind, places }: { kind: PlaceKind; places: PlaceAdminListRow[] }) {
  const plural = kind === "destination" ? "destinations" : "attractions";
  const title = kind === "destination" ? "Destinations" : "Attractions";
  return (
    <>
      <AdminPageHeader
        eyebrow="Places"
        title={title}
        description={
          kind === "destination"
            ? "Main Albanian cities linked to tours and map points."
            : "Landmarks nested under destinations and linked to the tours that visit them."
        }
        actions={
          <a className="admin-button is-primary" href={`/admin/${plural}/new`}>
            <Plus size={17} /> New {kind}
          </a>
        }
      />
      {!places.length ? (
        <AdminEmptyState
          title={`Create your first ${kind}`}
          description="Add bilingual content, three story sections, reusable imagery, a map point and linked tour packages."
          action={
            <a className="admin-button is-primary" href={`/admin/${plural}/new`}>
              <Plus size={17} /> New {kind}
            </a>
          }
        />
      ) : (
        <div className="admin-table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{title.slice(0, -1)}</th>
                {kind === "attraction" ? <th>Destination</th> : null}
                <th>Status</th>
                <th>Tours</th>
                <th>Languages</th>
                <th>Updated</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place.id}>
                  <td>
                    <div className="admin-table-title">
                      <strong>{place.titleEn || `Untitled ${kind}`}</strong>
                      <span>{place.slugEn ? `/${place.slugEn}` : "English slug missing"}</span>
                    </div>
                  </td>
                  {kind === "attraction" ? <td>{place.parentTitle || "Missing"}</td> : null}
                  <td>
                    <span className={`admin-status is-${place.status}`}>{place.status}</span>
                  </td>
                  <td>{place.linkedTourCount}</td>
                  <td>{place.titleEn && place.titleFr ? "EN · FR" : "Incomplete"}</td>
                  <td>{new Date(place.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-table-actions">
                      {place.status === "published" && place.slugEn ? (
                        <a
                          className="admin-icon-button"
                          href={
                            kind === "destination"
                              ? `/destinations/${place.slugEn}`
                              : `/attractions/${place.parentSlug}/${place.slugEn}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open published place"
                        >
                          <ExternalLink size={16} />
                        </a>
                      ) : null}
                      <a
                        className="admin-icon-button"
                        href={`/admin/${plural}/${place.id}`}
                        aria-label={`Edit ${kind}`}
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
