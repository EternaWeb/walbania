import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AdminPageHeader } from "../components/admin/AdminShell";
import { getAdminReferenceDataFn, saveTaxonomyFn } from "../lib/tours/server";
import type { TaxonomyItem, TaxonomyKind } from "../lib/tours/types";

export const Route = createFileRoute("/admin/taxonomies")({
  loader: () => getAdminReferenceDataFn(),
  component: AdminTaxonomiesPage,
});

function TaxonomyCard({
  title,
  kind,
  items,
}: {
  title: string;
  kind: TaxonomyKind;
  items: TaxonomyItem[];
}) {
  const [editing, setEditing] = useState<Partial<TaxonomyItem>>({
    key: "",
    nameEn: "",
    nameFr: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  return (
    <section className="admin-form-card">
      <h2>{title}</h2>
      <p>Bilingual labels are used in public tour facts and related-tour matching.</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          await saveTaxonomyFn({
            data: {
              kind,
              id: editing.id,
              key: editing.key || slugify(editing.nameEn || ""),
              nameEn: editing.nameEn || "",
              nameFr: editing.nameFr || "",
              active: editing.active ?? true,
            },
          });
          window.location.reload();
        }}
      >
        <div className="admin-field">
          <label>English name</label>
          <input
            className="admin-input"
            required
            value={editing.nameEn || ""}
            onChange={(event) =>
              setEditing({
                ...editing,
                nameEn: event.target.value,
                key: editing.id ? editing.key : slugify(event.target.value),
              })
            }
          />
        </div>
        <div className="admin-field" style={{ marginTop: 10 }}>
          <label>French name</label>
          <input className="admin-input" required value={editing.nameFr || ""} onChange={(event) => setEditing({ ...editing, nameFr: event.target.value })} />
        </div>
        <div className="admin-field" style={{ marginTop: 10 }}>
          <label>Key</label>
          <input className="admin-input" required value={editing.key || ""} onChange={(event) => setEditing({ ...editing, key: slugify(event.target.value) })} />
        </div>
        <label className="admin-check" style={{ display: "inline-block", marginTop: 10 }}>
          <input type="checkbox" checked={editing.active ?? true} onChange={(event) => setEditing({ ...editing, active: event.target.checked })} />
          <span>Active</span>
        </label>
        <button className="admin-button is-primary" type="submit" disabled={saving} style={{ marginTop: 12 }}>
          <Plus size={15} /> {editing.id ? "Update" : "Add"}
        </button>
      </form>
      <div className="admin-taxonomy-list">
        {items.map((item) => (
          <div className="admin-taxonomy-row" key={item.id}>
            <div>
              <strong>{item.nameEn}</strong>
              <small>{item.nameFr} · {item.key}{item.active ? "" : " · archived"}</small>
            </div>
            <button className="admin-icon-button" type="button" aria-label={`Edit ${item.nameEn}`} onClick={() => setEditing(item)}>
              <Pencil size={14} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminTaxonomiesPage() {
  const data = Route.useLoaderData();
  return (
    <>
      <AdminPageHeader
        eyebrow="Classification"
        title="Categories, types & difficulties"
        description="Maintain the reusable bilingual labels used by every tour."
      />
      <div className="admin-taxonomy-grid">
        <TaxonomyCard title="Categories" kind="categories" items={data.categories} />
        <TaxonomyCard title="Tour types" kind="tour_types" items={data.tourTypes} />
        <TaxonomyCard title="Difficulties" kind="difficulties" items={data.difficulties} />
      </div>
    </>
  );
}

