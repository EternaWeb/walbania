import { createClient } from "@supabase/supabase-js";
import { CircleAlert, ExternalLink, ImagePlus, Link2, LoaderCircle, Upload } from "lucide-react";
import { useState } from "react";
import type { GlobalMediaAsset } from "../../lib/places/types";
import { addMediaUrlFn, confirmMediaUploadFn, requestMediaUploadFn } from "../../lib/places/server";
import { AdminPageHeader } from "./AdminShell";

export function MediaLibraryManager({ initialAssets }: { initialAssets: GlobalMediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [url, setUrl] = useState("");
  const [creditName, setCreditName] = useState("");
  const [creditUrl, setCreditUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const addAsset = (asset: GlobalMediaAsset) =>
    setAssets((current) => [asset, ...current.filter((item) => item.id !== asset.id)]);
  const register = async () => {
    if (!url.trim()) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const asset = await addMediaUrlFn({
        data: { publicUrl: url.trim(), creditName: creditName.trim(), creditUrl: creditUrl.trim() },
      });
      addAsset(asset);
      setUrl("");
      setCreditName("");
      setCreditUrl("");
      setMessage("External image registered for reuse.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The URL could not be added.");
    } finally {
      setBusy(false);
    }
  };
  const upload = async (file: File) => {
    if (
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Use a JPEG, PNG, WebP or AVIF image no larger than 10 MB.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const ticket = await requestMediaUploadFn({
        data: {
          fileName: file.name,
          contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/avif",
          size: file.size,
        },
      });
      const client = createClient(ticket.url, ticket.publishableKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      });
      const { error: uploadError } = await client.storage
        .from("site-media")
        .uploadToSignedUrl(ticket.path, ticket.token, file, {
          contentType: file.type,
          cacheControl: "31536000",
        });
      if (uploadError) throw uploadError;
      addAsset(await confirmMediaUploadFn({ data: { path: ticket.path } }));
      setMessage("Upload is ready for tours, destinations and attractions.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Media library"
        description="One shared library for uploaded files, external image URLs, tours, destinations and attractions."
      />
      {error ? (
        <div className="admin-editor-notice is-error">
          <CircleAlert size={19} />
          <div>
            <strong>Needs attention</strong>
            <p>{error}</p>
          </div>
        </div>
      ) : null}
      {message ? (
        <div className="admin-editor-notice">
          <ImagePlus size={19} />
          <div>
            <strong>Ready</strong>
            <p>{message}</p>
          </div>
        </div>
      ) : null}
      <section className="admin-form-card">
        <h2>Add media</h2>
        <div className="admin-media-add-row is-library">
          <input
            type="url"
            placeholder="https://… image URL"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <input
            placeholder="Credit name"
            value={creditName}
            onChange={(event) => setCreditName(event.target.value)}
          />
          <input
            type="url"
            placeholder="Credit/source URL"
            value={creditUrl}
            onChange={(event) => setCreditUrl(event.target.value)}
          />
          <button className="admin-button" type="button" onClick={register} disabled={busy}>
            <Link2 size={15} /> Add URL
          </button>
          <label className="admin-button is-primary">
            <Upload size={15} /> Upload image
            <input
              hidden
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
                event.currentTarget.value = "";
              }}
            />
          </label>
        </div>
        {busy ? (
          <p className="admin-help">
            <LoaderCircle className="admin-spin" size={15} /> Processing media…
          </p>
        ) : null}
      </section>
      <section className="admin-form-card admin-media-library-page">
        <h2>{assets.length} reusable images</h2>
        <div className="admin-media-asset-grid">
          {assets.map((asset) => (
            <article className="admin-media-asset" key={asset.id}>
              <img src={asset.publicUrl} alt="" loading="lazy" />
              <div>
                <strong>{asset.creditName || "Uncredited image"}</strong>
                <span>
                  {asset.sourceKind} · {asset.mimeType}
                </span>
                {asset.creditUrl ? (
                  <a href={asset.creditUrl} target="_blank" rel="noreferrer">
                    Source <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
