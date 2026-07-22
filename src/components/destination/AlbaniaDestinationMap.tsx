import type { FeatureCollection, Point } from "geojson";
import { AlertCircle, ArrowRight, LocateFixed, MapPin, RefreshCw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoJSONSource, Map as MapLibreMap, MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export type DestinationMapLocation = {
  slug: string;
  name: string;
  region: string;
  summary: string;
  image: string;
  href: string;
  coordinates: readonly [longitude: number, latitude: number];
};

export const ALBANIA_DESTINATIONS: DestinationMapLocation[] = [
  {
    slug: "berat",
    name: "Berat",
    region: "Central Albania",
    summary: "Ottoman quarters, a living castle and slow evenings beside the Osum River.",
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=700&q=82",
    href: "/destination/berat",
    coordinates: [19.9437, 40.7058],
  },
  {
    slug: "tirana",
    name: "Tirana",
    region: "Central Albania",
    summary: "Creative neighbourhoods, vivid history and Albania's most energetic food scene.",
    image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=700&q=82",
    href: "/tour",
    coordinates: [19.8187, 41.3275],
  },
  {
    slug: "theth",
    name: "Theth",
    region: "Albanian Alps",
    summary: "A stone village framed by high peaks, waterfalls and celebrated mountain trails.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=82",
    href: "/tour",
    coordinates: [19.7747, 42.3953],
  },
  {
    slug: "gjirokaster",
    name: "Gjirokastër",
    region: "Southern Albania",
    summary: "Slate rooftops, fortress views and beautifully preserved Ottoman houses.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=700&q=82",
    href: "/tour",
    coordinates: [20.1389, 40.0758],
  },
  {
    slug: "sarande",
    name: "Sarandë",
    region: "Albanian Riviera",
    summary: "A bright Ionian base for beaches, ancient Butrint and the southern coast.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=82",
    href: "/tour",
    coordinates: [20.0063, 39.8756],
  },
];

function markerData(
  locations: DestinationMapLocation[],
  activeSlug: string,
  selectedSlug: string,
): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: locations.map((location) => ({
      type: "Feature",
      id: location.slug,
      geometry: { type: "Point", coordinates: [...location.coordinates] },
      properties: {
        slug: location.slug,
        name: location.name,
        active: location.slug === activeSlug,
        selected: location.slug === selectedSlug,
      },
    })),
  };
}

export function AlbaniaDestinationMap({
  activeSlug,
  locations = ALBANIA_DESTINATIONS,
}: {
  activeSlug: string;
  locations?: DestinationMapLocation[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(activeSlug);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retryKey, setRetryKey] = useState(0);
  const activeLocation = locations.find((location) => location.slug === activeSlug) ?? locations[0];
  const selectedLocation =
    locations.find((location) => location.slug === selectedSlug) ?? activeLocation;
  const locationsBySlug = useMemo(
    () => new Map(locations.map((location) => [location.slug, location])),
    [locations],
  );

  useEffect(() => {
    if (!containerRef.current || !activeLocation) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    let map: MapLibreMap | null = null;
    let loadTimeout: ReturnType<typeof setTimeout> | null = null;

    setStatus("loading");

    const initialize = async () => {
      try {
        const maplibregl = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;

        map = new maplibregl.Map({
          container: containerRef.current,
          style: "/maps/wonder-albania.json",
          center: [20.02, 41.12],
          zoom: 6.25,
          minZoom: 5.7,
          maxZoom: 13,
          maxBounds: [
            [18.45, 38.95],
            [21.85, 43.25],
          ],
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          renderWorldCopies: false,
          attributionControl: false,
        });
        mapRef.current = map;
        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }),
          "top-right",
        );
        map.addControl(
          new maplibregl.AttributionControl({
            compact: true,
            customAttribution:
              '<a href="https://openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a>',
          }),
        );

        loadTimeout = setTimeout(() => {
          if (!cancelled && !map?.loaded()) setStatus("error");
        }, 12000);

        map.on("load", () => {
          if (cancelled || !map) return;
          if (loadTimeout) clearTimeout(loadTimeout);

          map.addSource("destination-locations", {
            type: "geojson",
            data: markerData(locations, activeSlug, selectedSlug),
          });
          map.addLayer({
            id: "destination-pin-halo",
            type: "circle",
            source: "destination-locations",
            paint: {
              "circle-color": "#FFFFFF",
              "circle-radius": ["case", ["get", "selected"], 20, ["get", "active"], 18, 15],
              "circle-stroke-color": ["case", ["get", "active"], "#1F2528", "#FFFFFF"],
              "circle-stroke-width": ["case", ["get", "active"], 3, 2],
            },
          });
          map.addLayer({
            id: "destination-pins",
            type: "circle",
            source: "destination-locations",
            paint: {
              "circle-color": [
                "case",
                ["get", "selected"],
                "#1F2528",
                ["get", "active"],
                "#6C7D57",
                "#0A0A0A",
              ],
              "circle-radius": ["case", ["get", "selected"], 15, 12],
            },
          });
          map.addLayer({
            id: "destination-pin-labels",
            type: "symbol",
            source: "destination-locations",
            minzoom: 6,
            layout: {
              "text-anchor": "top",
              "text-field": ["get", "name"],
              "text-font": ["Noto Sans Bold"],
              "text-offset": [0, 1.7],
              "text-size": 11,
            },
            paint: {
              "text-color": "#0A0A0A",
              "text-halo-color": "#FFFFFF",
              "text-halo-width": 2,
            },
          });

          const selectLocation = (event: MapLayerMouseEvent) => {
            const slug = event.features?.[0]?.properties?.slug;
            if (typeof slug !== "string") return;
            const location = locationsBySlug.get(slug);
            if (!location) return;
            setSelectedSlug(slug);
            map?.easeTo({
              center: [...location.coordinates],
              zoom: Math.max(map.getZoom(), 7.2),
              duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650,
            });
          };

          map.on("click", "destination-pins", selectLocation);
          map.on("click", "destination-pin-labels", selectLocation);
          ["destination-pins", "destination-pin-labels"].forEach((layerId) => {
            map?.on("mouseenter", layerId, () => {
              if (map) map.getCanvas().style.cursor = "pointer";
            });
            map?.on("mouseleave", layerId, () => {
              if (map) map.getCanvas().style.cursor = "";
            });
          });

          setStatus("ready");
        });
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    void initialize();
    return () => {
      cancelled = true;
      if (loadTimeout) clearTimeout(loadTimeout);
      map?.remove();
      mapRef.current = null;
    };
  }, [activeLocation, activeSlug, locations, locationsBySlug, retryKey]);

  useEffect(() => {
    const source = mapRef.current?.getSource("destination-locations") as GeoJSONSource | undefined;
    source?.setData(markerData(locations, activeSlug, selectedSlug));
  }, [activeSlug, locations, selectedSlug]);

  const selectFromControls = (location: DestinationMapLocation) => {
    setSelectedSlug(location.slug);
    mapRef.current?.easeTo({
      center: [...location.coordinates],
      zoom: 7.2,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650,
    });
  };

  const resetMap = () => {
    setSelectedSlug(activeSlug);
    mapRef.current?.easeTo({
      center: [20.02, 41.12],
      zoom: 6.25,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650,
    });
  };

  return (
    <div className="destination-map-shell">
      <div
        ref={containerRef}
        className="destination-map-canvas"
        aria-label="Interactive map of destinations in Albania"
      />

      {status === "loading" && (
        <div className="destination-map-state" role="status">
          <MapPin size={21} />
          <span>Loading destinations…</span>
        </div>
      )}
      {status === "error" && (
        <div className="destination-map-state" role="alert">
          <AlertCircle size={22} />
          <strong>We couldn’t load the map</strong>
          <button type="button" onClick={() => setRetryKey((value) => value + 1)}>
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      )}

      {status === "ready" && (
        <>
          <button type="button" className="destination-map-reset" onClick={resetMap}>
            <LocateFixed size={15} /> Show all Albania
          </button>
          <div className="destination-map-preview" aria-live="polite">
            <button
              type="button"
              aria-label="Return to current destination"
              onClick={() => selectFromControls(activeLocation)}
            >
              <X size={16} />
            </button>
            <img src={selectedLocation.image} alt="" />
            <div>
              <span>{selectedLocation.region}</span>
              <strong>{selectedLocation.name}</strong>
              <p>{selectedLocation.summary}</p>
              <a href={selectedLocation.href}>
                Open destination <ArrowRight size={15} />
              </a>
            </div>
          </div>
          <div className="destination-map-controls" aria-label="Destinations on the map">
            {locations.map((location) => (
              <button
                type="button"
                className={location.slug === selectedSlug ? "is-active" : ""}
                aria-pressed={location.slug === selectedSlug}
                key={location.slug}
                onClick={() => selectFromControls(location)}
              >
                {location.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
