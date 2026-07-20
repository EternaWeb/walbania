import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  LineString,
  Point,
  Position,
} from "geojson";
import { AlertCircle, LocateFixed, MapPin, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  GeoJSONSource,
  LngLatBoundsLike,
  Map as MapLibreMap,
  MapLayerMouseEvent,
  Popup as MapLibrePopup,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSiteLocale } from "../i18n";

export type TourCoordinates = readonly [longitude: number, latitude: number];

export type TourItineraryStop = {
  id: string;
  sequence: number;
  time: string;
  place: string;
  duration: string;
  text: string;
  tag: string;
  location?: {
    id: string;
    label: string;
    coordinates: TourCoordinates;
    osmReference?: string;
  };
};

export type TourRouteGeometry = {
  type: "LineString";
  coordinates: TourCoordinates[];
};

export type TourItineraryMapProps = {
  stops: readonly TourItineraryStop[];
  activeStopId: string;
  onStopSelect: (stopId: string) => void;
  routeGeometry?: TourRouteGeometry;
  styleUrl?: string;
};

type StopGroup = {
  key: string;
  coordinates: TourCoordinates;
  stops: TourItineraryStop[];
};

type MarkerProperties = {
  groupKey: string;
  stopIds: string;
  sequence: number;
  stopCount: number;
  label: string;
  time: string;
  active: boolean;
};

const DEFAULT_STYLE_URL = "/maps/wonder-albania.json";
const BRAND = "#1F2528";
const INK = "#0A0A0A";
const MAP_COPY = {
  en: {
    interactiveMap: "Interactive map of the Albanian Riviera itinerary",
    loading: "Loading the Riviera route…",
    unavailable: "Route map unavailable",
    itineraryAvailable: "The itinerary is still available below.",
    loadError: "We couldn’t load the map",
    itineraryBeside: "Your full itinerary is still available beside it.",
    retry: "Try again",
    reset: "Reset route",
    mapStops: "Map stops",
    showStop: (sequence: number, place: string) => `Show stop ${sequence}, ${place}`,
    stopOf: (sequence: number, count: number) => `Stop ${sequence} of ${count}`,
    missing: (count: number) =>
      `${count} ${count === 1 ? "stop is" : "stops are"} missing map coordinates.`,
  },
  fr: {
    interactiveMap: "Carte interactive de l’itinéraire sur la Riviera albanaise",
    loading: "Chargement de l’itinéraire sur la Riviera…",
    unavailable: "Carte de l’itinéraire indisponible",
    itineraryAvailable: "L’itinéraire reste disponible ci-dessous.",
    loadError: "Impossible de charger la carte",
    itineraryBeside: "Votre itinéraire complet reste disponible à côté.",
    retry: "Réessayer",
    reset: "Réinitialiser l’itinéraire",
    mapStops: "Étapes sur la carte",
    showStop: (sequence: number, place: string) => `Afficher l’étape ${sequence}, ${place}`,
    stopOf: (sequence: number, count: number) => `Étape ${sequence} sur ${count}`,
    missing: (count: number) =>
      `${count} ${count === 1 ? "étape n’a" : "étapes n’ont"} pas de coordonnées.`,
  },
} as const;

function hasValidCoordinates(stop: TourItineraryStop) {
  const coordinates = stop.location?.coordinates;
  return Boolean(
    coordinates &&
    Number.isFinite(coordinates[0]) &&
    Number.isFinite(coordinates[1]) &&
    coordinates[0] >= -180 &&
    coordinates[0] <= 180 &&
    coordinates[1] >= -90 &&
    coordinates[1] <= 90,
  );
}

function groupStops(stops: readonly TourItineraryStop[]) {
  const groups = new Map<string, StopGroup>();
  const locationKeys = new Map<string, string>();
  const coordinateKeys = new Map<string, string>();

  stops.filter(hasValidCoordinates).forEach((stop) => {
    const location = stop.location!;
    const coordinateKey = `${location.coordinates[0].toFixed(4)}:${location.coordinates[1].toFixed(4)}`;
    const key =
      locationKeys.get(location.id) ??
      coordinateKeys.get(coordinateKey) ??
      location.id ??
      coordinateKey;
    const existing = groups.get(key);

    if (existing) {
      existing.stops.push(stop);
      existing.stops.sort((a, b) => a.sequence - b.sequence);
      locationKeys.set(location.id, key);
      coordinateKeys.set(coordinateKey, key);
      return;
    }

    groups.set(key, {
      key,
      coordinates: location.coordinates,
      stops: [stop],
    });
    locationKeys.set(location.id, key);
    coordinateKeys.set(coordinateKey, key);
  });

  return [...groups.values()];
}

function stopsToMarkerData(
  groups: readonly StopGroup[],
  activeStopId: string,
): FeatureCollection<Point, MarkerProperties> {
  return {
    type: "FeatureCollection",
    features: groups.map((group) => {
      const firstStop = group.stops[0];
      return {
        type: "Feature",
        id: group.key,
        geometry: {
          type: "Point",
          coordinates: [...group.coordinates],
        },
        properties: {
          groupKey: group.key,
          stopIds: JSON.stringify(group.stops.map((stop) => stop.id)),
          sequence: firstStop.sequence,
          stopCount: group.stops.length,
          label: group.stops.map((stop) => stop.place).join(" / "),
          time: group.stops.map((stop) => stop.time).join(" · "),
          active: group.stops.some((stop) => stop.id === activeStopId),
        },
      };
    }),
  };
}

function routeFeature(
  stops: readonly TourItineraryStop[],
  routeGeometry?: TourRouteGeometry,
): Feature<LineString> {
  const fallbackCoordinates = stops
    .filter(hasValidCoordinates)
    .map((stop) => [...stop.location!.coordinates] as Position);
  const coordinates = routeGeometry?.coordinates.length
    ? routeGeometry.coordinates.map((coordinate) => [...coordinate])
    : fallbackCoordinates;

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates:
        coordinates.length >= 2
          ? coordinates
          : coordinates.length === 1
            ? [coordinates[0], coordinates[0]]
            : [
                [19.7, 40],
                [19.8, 40.1],
              ],
    },
  };
}

function progressFeature(
  stops: readonly TourItineraryStop[],
  activeStopId: string,
  routeGeometry?: TourRouteGeometry,
): FeatureCollection<LineString> {
  const stopIndex = stops.findIndex((stop) => stop.id === activeStopId);
  let coordinates: Position[] = [];

  if (routeGeometry?.coordinates.length && stopIndex >= 0) {
    let routeCursor = 0;
    const stopRouteIndexes = stops.map((stop) => {
      if (!hasValidCoordinates(stop)) return -1;
      const target = stop.location!.coordinates;
      const matchIndex = routeGeometry.coordinates.findIndex(
        (coordinate, index) =>
          index >= routeCursor &&
          Math.abs(coordinate[0] - target[0]) < 0.000001 &&
          Math.abs(coordinate[1] - target[1]) < 0.000001,
      );
      if (matchIndex >= 0) routeCursor = matchIndex + 1;
      return matchIndex;
    });
    const routeEndIndex = stopRouteIndexes[stopIndex];
    if (routeEndIndex >= 0) {
      coordinates = routeGeometry.coordinates
        .slice(0, routeEndIndex + 1)
        .map((coordinate) => [...coordinate]);
    }
  }

  if (coordinates.length === 0) {
    coordinates = stops
      .slice(0, stopIndex + 1)
      .filter(hasValidCoordinates)
      .map((stop) => [...stop.location!.coordinates] as Position);
  }

  if (coordinates.length < 2) {
    return { type: "FeatureCollection", features: [] };
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates },
      },
    ],
  };
}

function paddedBounds(stops: readonly TourItineraryStop[]): LngLatBoundsLike {
  const coordinates = stops.filter(hasValidCoordinates).map((stop) => stop.location!.coordinates);
  if (coordinates.length === 0) {
    return [
      [19.65, 39.82],
      [20.06, 40.15],
    ];
  }

  const longitudes = coordinates.map(([longitude]) => longitude);
  const latitudes = coordinates.map(([, latitude]) => latitude);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const longitudePadding = Math.max((maxLongitude - minLongitude) * 0.2, 0.04);
  const latitudePadding = Math.max((maxLatitude - minLatitude) * 0.2, 0.04);

  return [
    [minLongitude - longitudePadding, minLatitude - latitudePadding],
    [maxLongitude + longitudePadding, maxLatitude + latitudePadding],
  ];
}

function parseStopIds(properties: GeoJsonProperties) {
  if (!properties || typeof properties.stopIds !== "string") return [];

  try {
    const parsed = JSON.parse(properties.stopIds);
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function TourItineraryMap({
  stops,
  activeStopId,
  onStopSelect,
  routeGeometry,
  styleUrl = DEFAULT_STYLE_URL,
}: TourItineraryMapProps) {
  const locale = useSiteLocale();
  const copy = MAP_COPY[locale];
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<MapLibrePopup | null>(null);
  const onStopSelectRef = useRef(onStopSelect);
  const activeStopIdRef = useRef(activeStopId);
  const [retryKey, setRetryKey] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const groups = useMemo(() => groupStops(stops), [stops]);
  const validStops = useMemo(() => stops.filter(hasValidCoordinates), [stops]);
  const missingStops = stops.length - validStops.length;
  const bounds = useMemo(() => paddedBounds(validStops), [validStops]);
  const activeStop = stops.find((stop) => stop.id === activeStopId) ?? validStops[0];

  useEffect(() => {
    onStopSelectRef.current = onStopSelect;
  }, [onStopSelect]);

  useEffect(() => {
    activeStopIdRef.current = activeStopId;
  }, [activeStopId]);

  useEffect(() => {
    if (!containerRef.current || validStops.length === 0) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    let map: MapLibreMap | null = null;
    let loadTimeout: ReturnType<typeof setTimeout> | null = null;
    const pointerLayers = ["itinerary-clusters", "itinerary-pins", "itinerary-pin-labels"];

    setStatus("loading");

    const initializeMap = async () => {
      try {
        const maplibregl = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;

        map = new maplibregl.Map({
          container: containerRef.current,
          style: styleUrl,
          bounds,
          fitBoundsOptions: { padding: 54, maxZoom: 11.5, duration: 0 },
          maxBounds: bounds,
          minZoom: 8,
          maxZoom: 15,
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          renderWorldCopies: false,
          attributionControl: false,
          locale:
            locale === "fr"
              ? {
                  "NavigationControl.ZoomIn": "Zoomer",
                  "NavigationControl.ZoomOut": "Dézoomer",
                  "Popup.Close": "Fermer",
                  "AttributionControl.ToggleAttribution": "Afficher les crédits",
                  "CooperativeGesturesHandler.WindowsHelpText":
                    "Utilisez Ctrl + défilement pour zoomer sur la carte",
                  "CooperativeGesturesHandler.MacHelpText":
                    "Utilisez ⌘ + défilement pour zoomer sur la carte",
                  "CooperativeGesturesHandler.MobileHelpText":
                    "Utilisez deux doigts pour déplacer la carte",
                }
              : undefined,
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

          map.addSource("itinerary-route", {
            type: "geojson",
            data: routeFeature(validStops, routeGeometry),
          });
          map.addLayer({
            id: "itinerary-route-shadow",
            type: "line",
            source: "itinerary-route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": "#FFFFFF",
              "line-opacity": 0.9,
              "line-width": 8,
            },
          });
          map.addLayer({
            id: "itinerary-route-line",
            type: "line",
            source: "itinerary-route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": BRAND,
              "line-dasharray": [1.2, 1.2],
              "line-opacity": 0.48,
              "line-width": 4,
            },
          });

          map.addSource("itinerary-progress", {
            type: "geojson",
            data: progressFeature(validStops, activeStopIdRef.current, routeGeometry),
          });
          map.addLayer({
            id: "itinerary-progress-line",
            type: "line",
            source: "itinerary-progress",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": BRAND,
              "line-opacity": 1,
              "line-width": 5,
            },
          });

          map.addSource("itinerary-stops", {
            type: "geojson",
            data: stopsToMarkerData(groups, activeStopIdRef.current),
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 46,
          });
          map.addLayer({
            id: "itinerary-clusters",
            type: "circle",
            source: "itinerary-stops",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": BRAND,
              "circle-radius": ["step", ["get", "point_count"], 18, 4, 22],
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 3,
            },
          });
          map.addLayer({
            id: "itinerary-cluster-count",
            type: "symbol",
            source: "itinerary-stops",
            filter: ["has", "point_count"],
            layout: {
              "text-field": ["get", "point_count_abbreviated"],
              "text-font": ["Noto Sans Bold"],
              "text-size": 11,
            },
            paint: { "text-color": "#FFFFFF" },
          });
          map.addLayer({
            id: "itinerary-pin-halo",
            type: "circle",
            source: "itinerary-stops",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": "#FFFFFF",
              "circle-radius": ["case", ["get", "active"], 21, 18],
              "circle-opacity": 0.98,
              "circle-stroke-color": ["case", ["get", "active"], BRAND, "#FFFFFF"],
              "circle-stroke-width": ["case", ["get", "active"], 3, 2],
            },
          });
          map.addLayer({
            id: "itinerary-pins",
            type: "circle",
            source: "itinerary-stops",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": ["case", ["get", "active"], BRAND, INK],
              "circle-radius": ["case", ["get", "active"], 16, 14],
            },
          });
          map.addLayer({
            id: "itinerary-pin-numbers",
            type: "symbol",
            source: "itinerary-stops",
            filter: ["!", ["has", "point_count"]],
            layout: {
              "text-field": [
                "case",
                [">", ["get", "stopCount"], 1],
                ["concat", ["to-string", ["get", "sequence"]], "+"],
                ["to-string", ["get", "sequence"]],
              ],
              "text-font": ["Noto Sans Bold"],
              "text-size": 11,
            },
            paint: { "text-color": "#FFFFFF" },
          });
          map.addLayer({
            id: "itinerary-pin-labels",
            type: "symbol",
            source: "itinerary-stops",
            filter: ["!", ["has", "point_count"]],
            minzoom: 9.2,
            layout: {
              "text-anchor": "top",
              "text-field": ["concat", ["get", "label"], " · ", ["get", "time"]],
              "text-font": ["Noto Sans Regular"],
              "text-max-width": 14,
              "text-offset": [0, 1.8],
              "text-size": 11,
            },
            paint: {
              "text-color": INK,
              "text-halo-color": "#FFFFFF",
              "text-halo-width": 2,
            },
          });

          const selectFeature = (event: MapLayerMouseEvent) => {
            if (!map) return;
            const feature = event.features?.[0];
            if (!feature) return;
            const stopIds = parseStopIds(feature.properties);
            if (stopIds.length === 0) return;

            if (stopIds.length === 1) {
              onStopSelectRef.current(stopIds[0]);
              return;
            }

            popupRef.current?.remove();
            const group = groups.find((item) => item.key === feature.properties?.groupKey);
            if (!group) return;

            const popupContent = document.createElement("div");
            popupContent.className = "itinerary-map-popup";
            const popupTitle = document.createElement("strong");
            popupTitle.textContent = group.stops[0].location?.label ?? group.stops[0].place;
            popupContent.append(popupTitle);

            group.stops.forEach((stop) => {
              const button = document.createElement("button");
              button.type = "button";
              button.textContent = `${String(stop.sequence).padStart(2, "0")} · ${stop.time} · ${stop.place}`;
              button.addEventListener("click", () => {
                onStopSelectRef.current(stop.id);
                popupRef.current?.remove();
              });
              popupContent.append(button);
            });

            popupRef.current = new maplibregl.Popup({
              closeButton: true,
              closeOnClick: false,
              maxWidth: "280px",
            })
              .setLngLat([...group.coordinates])
              .setDOMContent(popupContent)
              .addTo(map);
          };

          map.on("click", "itinerary-pins", selectFeature);
          map.on("click", "itinerary-pin-labels", selectFeature);
          map.on("click", "itinerary-clusters", async (event) => {
            if (!map) return;
            const feature = event.features?.[0];
            const clusterId = feature?.properties?.cluster_id;
            if (typeof clusterId !== "number") return;
            const source = map.getSource("itinerary-stops") as GeoJSONSource;
            const zoom = await source.getClusterExpansionZoom(clusterId);
            const coordinates = (feature?.geometry as Point | undefined)?.coordinates;
            if (!coordinates) return;
            map.easeTo({
              center: [coordinates[0], coordinates[1]],
              zoom: Math.min(zoom, 15),
              duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 550,
            });
          });

          pointerLayers.forEach((layerId) => {
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

    void initializeMap();

    const closePopupOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") popupRef.current?.remove();
    };
    window.addEventListener("keydown", closePopupOnEscape);

    return () => {
      cancelled = true;
      if (loadTimeout) clearTimeout(loadTimeout);
      window.removeEventListener("keydown", closePopupOnEscape);
      popupRef.current?.remove();
      popupRef.current = null;
      map?.remove();
      mapRef.current = null;
    };
  }, [bounds, groups, locale, retryKey, routeGeometry, styleUrl, validStops]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource("itinerary-stops")) return;

    const markerSource = map.getSource("itinerary-stops") as GeoJSONSource | undefined;
    markerSource?.setData(stopsToMarkerData(groups, activeStopId));

    const progressSource = map.getSource("itinerary-progress") as GeoJSONSource | undefined;
    progressSource?.setData(progressFeature(validStops, activeStopId, routeGeometry));

    const selectedStop = validStops.find((stop) => stop.id === activeStopId);
    if (!selectedStop?.location) return;

    map.easeTo({
      center: [...selectedStop.location.coordinates],
      zoom: Math.max(map.getZoom(), 10.6),
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650,
      essential: false,
    });
  }, [activeStopId, groups, routeGeometry, validStops]);

  const resetMap = () => {
    mapRef.current?.fitBounds(bounds, {
      padding: 54,
      maxZoom: 11.5,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650,
    });
  };

  if (validStops.length === 0) {
    return (
      <div className="itinerary-map-fallback" role="status">
        <AlertCircle size={22} />
        <strong>{copy.unavailable}</strong>
        <p>{copy.itineraryAvailable}</p>
      </div>
    );
  }

  return (
    <div className="itinerary-map-shell">
      <div ref={containerRef} className="itinerary-map-canvas" aria-label={copy.interactiveMap} />

      {status === "loading" && (
        <div className="itinerary-map-loading" role="status">
          <MapPin size={21} />
          <span>{copy.loading}</span>
        </div>
      )}

      {status === "error" && (
        <div className="itinerary-map-fallback itinerary-map-fallback-overlay" role="alert">
          <AlertCircle size={22} />
          <strong>{copy.loadError}</strong>
          <p>{copy.itineraryBeside}</p>
          <button type="button" onClick={() => setRetryKey((value) => value + 1)}>
            <RefreshCw size={15} /> {copy.retry}
          </button>
        </div>
      )}

      {status === "ready" && (
        <>
          <button type="button" className="itinerary-map-reset" onClick={resetMap}>
            <LocateFixed size={15} /> {copy.reset}
          </button>
          <div className="itinerary-map-stop-controls" aria-label={copy.mapStops}>
            {stops.map((stop) => (
              <button
                type="button"
                className={stop.id === activeStopId ? "is-active" : ""}
                aria-label={copy.showStop(stop.sequence, stop.place)}
                aria-pressed={stop.id === activeStopId}
                key={stop.id}
                onClick={() => onStopSelect(stop.id)}
              >
                {stop.sequence}
              </button>
            ))}
          </div>
          {activeStop && (
            <div className="itinerary-map-progress" aria-live="polite">
              <span>{copy.stopOf(activeStop.sequence, stops.length)}</span>
              <strong>{activeStop.place}</strong>
              <small>
                {activeStop.time} · {activeStop.duration}
              </small>
            </div>
          )}
        </>
      )}

      {missingStops > 0 && <div className="itinerary-map-notice">{copy.missing(missingStops)}</div>}
    </div>
  );
}
