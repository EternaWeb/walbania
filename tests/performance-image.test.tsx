import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PerformanceImage } from "../src/components/PerformanceImage";

describe("responsive performance images", () => {
  test("gives Wikimedia heroes responsive sources, dimensions and LCP priority", () => {
    const markup = renderToStaticMarkup(
      <PerformanceImage
        src="https://commons.wikimedia.org/wiki/Special:FilePath/Tirana.jpg?width=2400"
        alt="Tirana"
        width={1600}
        height={1067}
        sizes="100vw"
        maxWidth={1600}
        priority
      />,
    );

    expect(markup).toContain("width=360");
    expect(markup).toContain("width=1600");
    expect(markup).not.toContain("width=2400");
    expect(markup).toContain('width="1600"');
    expect(markup).toContain('height="1067"');
    expect(markup).toContain('loading="eager"');
    expect(markup).toContain('fetchPriority="high"');
  });

  test("converts direct Commons originals to thumbnail URLs for lazy cards", () => {
    const markup = renderToStaticMarkup(
      <PerformanceImage
        src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Example.jpg"
        alt="Example destination"
        width={900}
        height={600}
        sizes="420px"
        maxWidth={900}
      />,
    );

    expect(markup).toContain("/wikipedia/commons/thumb/a/ab/Example.jpg/900px-Example.jpg");
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain('fetchPriority="low"');
  });

  test("requests screen-sized next-generation Unsplash assets", () => {
    const markup = renderToStaticMarkup(
      <PerformanceImage
        src="https://images.unsplash.com/photo-example?w=2400&q=95"
        alt="Albanian landscape"
        width={900}
        height={600}
        sizes="420px"
        maxWidth={900}
      />,
    );

    expect(markup).toContain("w=900");
    expect(markup).toContain("auto=format");
    expect(markup).toContain("fit=crop");
  });
});
