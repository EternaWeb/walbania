import { Check, ExternalLink, ImageIcon, LoaderCircle, Save } from "lucide-react";
import { useState } from "react";
import { saveCollectionFn } from "../../lib/collections/server";
import type {
  CollectionAdminData,
  CollectionAdminItem,
  CollectionMediaAsset,
} from "../../lib/collections/types";
import { AdminPageHeader } from "./AdminShell";

function CollectionEditor({
  initialCollection,
  mediaAssets,
}: {
  initialCollection: CollectionAdminItem;
  mediaAssets: CollectionMediaAsset[];
}) {
  const [collection, setCollection] = useState(initialCollection);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const selectedAsset = mediaAssets.find((asset) => asset.id === collection.heroAssetId);
  const update = <Key extends keyof CollectionAdminItem>(
    key: Key,
    value: CollectionAdminItem[Key],
  ) => setCollection((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="admin-form-card admin-collection-editor"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setSaved(false);
        setError("");
        try {
          await saveCollectionFn({
            data: {
              id: collection.id,
              nameEn: collection.nameEn,
              nameFr: collection.nameFr,
              descriptionEn: collection.descriptionEn,
              descriptionFr: collection.descriptionFr,
              heroAssetId: collection.heroAssetId,
              heroAltEn: collection.heroAltEn,
              heroAltFr: collection.heroAltFr,
              enabled: collection.enabled,
              active: collection.active,
              sortOrder: collection.sortOrder,
            },
          });
          setSaved(true);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : "The collection could not be saved.");
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="admin-collection-heading">
        <div>
          <span>/{collection.key}</span>
          <h2>{collection.nameEn}</h2>
        </div>
        <a href={`/collection/${collection.key}`} target="_blank" rel="noreferrer">
          Preview <ExternalLink size={13} />
        </a>
      </div>

      <div className="admin-collection-layout">
        <div className="admin-collection-preview">
          {selectedAsset?.publicUrl || collection.image ? (
            <img
              src={selectedAsset?.publicUrl || collection.image}
              alt={collection.heroAltEn}
              loading="lazy"
            />
          ) : (
            <span>
              <ImageIcon size={25} /> Select a hero image
            </span>
          )}
        </div>

        <div className="admin-collection-fields">
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor={`${collection.id}-name-en`}>English name</label>
              <input
                id={`${collection.id}-name-en`}
                className="admin-input"
                value={collection.nameEn}
                onChange={(event) => update("nameEn", event.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor={`${collection.id}-name-fr`}>French name</label>
              <input
                id={`${collection.id}-name-fr`}
                className="admin-input"
                value={collection.nameFr}
                onChange={(event) => update("nameFr", event.target.value)}
                required
              />
            </div>
            <div className="admin-field is-full">
              <label htmlFor={`${collection.id}-image`}>Hero and card image</label>
              <select
                id={`${collection.id}-image`}
                className="admin-select"
                value={collection.heroAssetId ?? ""}
                onChange={(event) => update("heroAssetId", event.target.value || null)}
                required
              >
                <option value="">Select from media library</option>
                {mediaAssets.map((asset) => (
                  <option value={asset.id} key={asset.id}>
                    {asset.creditName || "Uncredited image"} — {asset.publicUrl}
                  </option>
                ))}
              </select>
              <small>
                The same image appears on the directory card, homepage card and collection hero.
              </small>
            </div>
            <div className="admin-field">
              <label htmlFor={`${collection.id}-alt-en`}>English image description</label>
              <input
                id={`${collection.id}-alt-en`}
                className="admin-input"
                value={collection.heroAltEn}
                onChange={(event) => update("heroAltEn", event.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor={`${collection.id}-alt-fr`}>French image description</label>
              <input
                id={`${collection.id}-alt-fr`}
                className="admin-input"
                value={collection.heroAltFr}
                onChange={(event) => update("heroAltFr", event.target.value)}
                required
              />
            </div>
            <div className="admin-field is-full">
              <label htmlFor={`${collection.id}-description-en`}>English description</label>
              <textarea
                id={`${collection.id}-description-en`}
                className="admin-textarea"
                rows={4}
                value={collection.descriptionEn}
                onChange={(event) => update("descriptionEn", event.target.value)}
                required
              />
            </div>
            <div className="admin-field is-full">
              <label htmlFor={`${collection.id}-description-fr`}>French description</label>
              <textarea
                id={`${collection.id}-description-fr`}
                className="admin-textarea"
                rows={4}
                value={collection.descriptionFr}
                onChange={(event) => update("descriptionFr", event.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor={`${collection.id}-sort`}>Display order</label>
              <input
                id={`${collection.id}-sort`}
                className="admin-input"
                type="number"
                min={0}
                max={999}
                value={collection.sortOrder}
                onChange={(event) => update("sortOrder", Number(event.target.value))}
              />
            </div>
            <div className="admin-collection-checks">
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={collection.enabled}
                  onChange={(event) => update("enabled", event.target.checked)}
                />
                <span>Show collection publicly</span>
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={collection.active}
                  onChange={(event) => update("active", event.target.checked)}
                />
                <span>Available for tour assignment</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {error ? <p className="admin-help is-error">{error}</p> : null}
      <div className="admin-collection-actions">
        {saved ? (
          <span>
            <Check size={15} /> Saved
          </span>
        ) : null}
        <button className="admin-button is-primary" type="submit" disabled={saving}>
          {saving ? <LoaderCircle className="admin-spin" size={15} /> : <Save size={15} />}
          Save collection
        </button>
      </div>
    </form>
  );
}

export function CollectionManager({ initialData }: { initialData: CollectionAdminData }) {
  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Holiday collections"
        description="Choose the shared card and hero image, edit the collection description and control which collection pages are public."
      />
      <div className="admin-collection-list">
        {initialData.collections.map((collection) => (
          <CollectionEditor
            initialCollection={collection}
            mediaAssets={initialData.mediaAssets}
            key={collection.id}
          />
        ))}
      </div>
    </>
  );
}
