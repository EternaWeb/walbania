import "../../collection.css";
import type { CollectionSummary } from "../../lib/collections/types";
import { PerformanceImage } from "../PerformanceImage";

export function HolidayCollectionCard({
  collection,
  priority = false,
}: {
  collection: CollectionSummary;
  priority?: boolean;
}) {
  return (
    <a className="holiday-collection-card" href={collection.href}>
      <span className="holiday-collection-media">
        {collection.image ? (
          <PerformanceImage
            src={collection.image}
            alt={collection.imageAlt}
            width={1000}
            height={1200}
            sizes="(max-width: 720px) 64vw, (max-width: 1200px) 42vw, 25vw"
            maxWidth={1200}
            priority={priority}
          />
        ) : (
          <span className="holiday-collection-fallback" aria-hidden="true">
            Wonder Albania
          </span>
        )}
      </span>
      <span className="holiday-collection-title">{collection.name}</span>
    </a>
  );
}
