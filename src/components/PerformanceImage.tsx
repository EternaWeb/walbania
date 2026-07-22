import type { ImgHTMLAttributes } from "react";

const DEFAULT_WIDTHS = [360, 480, 640, 768, 960, 1200, 1600, 1920, 2400] as const;

function wikimediaUploadUrl(url: URL, width: number) {
  const path = url.pathname;
  if (!path.startsWith("/wikipedia/commons/")) return null;

  const segments = path.split("/").filter(Boolean);
  const thumbIndex = segments.indexOf("thumb");

  if (thumbIndex >= 0) {
    const fileName = segments[thumbIndex + 3];
    if (!fileName || fileName.toLowerCase().endsWith(".svg")) return null;
    segments[segments.length - 1] = `${width}px-${fileName}`;
    url.pathname = `/${segments.join("/")}`;
    return url.toString();
  }

  const fileName = segments[segments.length - 1];
  if (!fileName || fileName.toLowerCase().endsWith(".svg") || segments.length < 4) return null;

  const directoryParts = segments.slice(0, -1);
  directoryParts.splice(2, 0, "thumb");
  url.pathname = `/${[...directoryParts, fileName, `${width}px-${fileName}`].join("/")}`;
  return url.toString();
}

function imageUrlAtWidth(source: string, width: number) {
  try {
    const url = new URL(source);

    if (
      url.hostname === "commons.wikimedia.org" &&
      url.pathname.toLowerCase().includes("/wiki/special:filepath/")
    ) {
      url.searchParams.set("width", String(width));
      return url.toString();
    }

    if (url.hostname === "upload.wikimedia.org") {
      return wikimediaUploadUrl(url, width) ?? source;
    }

    if (url.hostname === "images.unsplash.com") {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", "82");
      return url.toString();
    }
  } catch {
    return source;
  }

  return source;
}

function responsiveCandidates(source: string, maxWidth: number) {
  const widths = Array.from(
    new Set([...DEFAULT_WIDTHS.filter((width) => width < maxWidth), maxWidth]),
  );
  const candidates = widths.map((width) => ({ width, url: imageUrlAtWidth(source, width) }));

  if (candidates.every((candidate) => candidate.url === source)) return undefined;
  return candidates.map((candidate) => `${candidate.url} ${candidate.width}w`).join(", ");
}

type PerformanceImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "sizes" | "loading" | "decoding" | "fetchPriority" | "alt"
> & {
  src: string;
  alt: string;
  sizes: string;
  maxWidth?: number;
  priority?: boolean;
};

export function PerformanceImage({
  src,
  sizes,
  maxWidth = 1600,
  priority = false,
  ...props
}: PerformanceImageProps) {
  return (
    <img
      {...props}
      src={imageUrlAtWidth(src, maxWidth)}
      srcSet={responsiveCandidates(src, maxWidth)}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
    />
  );
}
