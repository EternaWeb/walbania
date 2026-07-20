import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Star } from "lucide-react";
import { useState } from "react";
import { AdminPageHeader } from "../components/admin/AdminShell";
import { getAdminReferenceDataFn, saveReviewFn } from "../lib/tours/server";
import type { ReviewRecord, TravelType } from "../lib/tours/types";

export const Route = createFileRoute("/admin/reviews")({
  loader: () => getAdminReferenceDataFn(),
  component: AdminReviewsPage,
});

const emptyReview = (): Omit<ReviewRecord, "id"> & { id?: string } => ({
  name: "",
  reviewDate: new Date().toISOString().slice(0, 10),
  nationCode: "GB",
  rating: 5,
  travelType: "couple",
  originalLanguage: "en",
  bodyOriginal: "",
  bodyEn: "",
  bodyFr: "",
});

function AdminReviewsPage() {
  const { reviews } = Route.useLoaderData();
  const [form, setForm] = useState(emptyReview());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <AdminPageHeader
        eyebrow="Traveller stories"
        title="Reviews"
        description="Build a reusable review library, then assign reviews to tours by name."
        actions={
          <button className="admin-button" type="button" onClick={() => setForm(emptyReview())}>
            <Plus size={16} /> New review
          </button>
        }
      />
      <section className="admin-dashboard-grid">
        <div className="admin-table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Traveller</th>
                <th>Rating</th>
                <th>Date</th>
                <th>Travel type</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <div className="admin-table-title">
                      <strong>{review.name}</strong>
                      <span>{review.nationCode}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <Star size={14} fill="currentColor" /> {review.rating}
                    </span>
                  </td>
                  <td>{review.reviewDate}</td>
                  <td>{review.travelType}</td>
                  <td>
                    <button
                      className="admin-icon-button"
                      type="button"
                      aria-label={`Edit ${review.name}`}
                      onClick={() => setForm(review)}
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={5}>No reviews have been added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <form
          className="admin-form-card"
          onSubmit={async (event) => {
            event.preventDefault();
            setSaving(true);
            setError("");
            try {
              await saveReviewFn({
                data: {
                  ...form,
                  nationCode: form.nationCode.toUpperCase(),
                },
              });
              window.location.reload();
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "The review could not be saved.");
              setSaving(false);
            }
          }}
        >
          <h2>{form.id ? "Edit review" : "Add review"}</h2>
          <p>The original text is always preserved. English and French translations are optional.</p>
          <div className="admin-form-grid">
            <div className="admin-field is-full">
              <label>Name</label>
              <input className="admin-input" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="admin-field">
              <label>Date</label>
              <input className="admin-input" type="date" required value={form.reviewDate} onChange={(event) => setForm({ ...form, reviewDate: event.target.value })} />
            </div>
            <div className="admin-field">
              <label>Nation code</label>
              <input className="admin-input" required maxLength={2} value={form.nationCode} onChange={(event) => setForm({ ...form, nationCode: event.target.value.toUpperCase() })} />
            </div>
            <div className="admin-field">
              <label>Rating</label>
              <select className="admin-select" value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}>
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label>Travel type</label>
              <select className="admin-select" value={form.travelType} onChange={(event) => setForm({ ...form, travelType: event.target.value as TravelType })}>
                {["solo", "couple", "family", "friends", "group", "business", "other"].map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label>Original language</label>
              <input className="admin-input" required value={form.originalLanguage} onChange={(event) => setForm({ ...form, originalLanguage: event.target.value })} />
            </div>
            <div />
            <div className="admin-field is-full">
              <label>Original review</label>
              <textarea className="admin-textarea" required value={form.bodyOriginal} onChange={(event) => setForm({ ...form, bodyOriginal: event.target.value })} />
            </div>
            <div className="admin-field is-full">
              <label>English translation</label>
              <textarea className="admin-textarea" value={form.bodyEn} onChange={(event) => setForm({ ...form, bodyEn: event.target.value })} />
            </div>
            <div className="admin-field is-full">
              <label>French translation</label>
              <textarea className="admin-textarea" value={form.bodyFr} onChange={(event) => setForm({ ...form, bodyFr: event.target.value })} />
            </div>
          </div>
          <button className="admin-button is-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save review"}
          </button>
          {error && <div className="admin-form-error">{error}</div>}
        </form>
      </section>
    </>
  );
}

