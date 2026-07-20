import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { DynamicTourPage } from "../components/tour/DynamicTourPage";
import { getPublicTourFn } from "../lib/tours/server";
import type { TourViewModel } from "../lib/tours/types";

function jsonLd(tour: TourViewModel) {
  const canonical = `${tour.siteUrl}${tour.href}`;
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: `${tour.siteUrl}/fr/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Circuits",
          item: `${tour.siteUrl}/fr/tour`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tour.title,
          item: canonical,
        },
      ],
    },
    {
      "@type": ["Product", "TouristTrip"],
      name: tour.title,
      description: tour.seoDescription,
      image: [tour.heroImage, ...tour.gallery.map((image) => image.src)],
      url: canonical,
      touristType: tour.categoryNames,
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: tour.basePriceEur,
        availability: tour.defaultAvailable
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
        url: canonical,
      },
      ...(tour.ratingCount > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: tour.ratingAverage,
              reviewCount: tour.ratingCount,
              bestRating: 5,
              worstRating: 1,
            },
            review: tour.reviews.slice(0, 5).map((review) => ({
              "@type": "Review",
              author: { "@type": "Person", name: review.name },
              datePublished: review.reviewDate,
              reviewBody: review.body,
              reviewRating: {
                "@type": "Rating",
                ratingValue: review.rating,
                bestRating: 5,
                worstRating: 1,
              },
            })),
          }
        : {}),
    },
  ];
  if (tour.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: tour.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
    /</g,
    "\\u003c",
  );
}

export const Route = createFileRoute("/fr_/tour_/$slug")({
  loader: async ({ params }) => {
    const result = await getPublicTourFn({ data: { slug: params.slug, locale: "fr" } });
    if (result.kind === "not-found") throw notFound();
    if (result.kind === "redirect") {
      throw redirect({ href: result.location, statusCode: 301 });
    }
    return result.tour;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const canonical = `${loaderData.siteUrl}${loaderData.href}`;
    const alternate = `${loaderData.siteUrl}${loaderData.alternateHref}`;
    return {
      meta: [
        { title: loaderData.seoTitle || loaderData.title },
        { name: "description", content: loaderData.seoDescription },
        { property: "og:type", content: "website" },
        { property: "og:title", content: loaderData.seoTitle || loaderData.title },
        { property: "og:description", content: loaderData.seoDescription },
        { property: "og:url", content: canonical },
        { property: "og:image", content: loaderData.heroImage },
        { property: "og:image:alt", content: loaderData.heroAlt },
        { property: "og:locale", content: "fr_FR" },
        { property: "og:locale:alternate", content: "en_US" },
        { name: "twitter:title", content: loaderData.seoTitle || loaderData.title },
        { name: "twitter:description", content: loaderData.seoDescription },
        { name: "twitter:image", content: loaderData.heroImage },
      ],
      links: [
        { rel: "canonical", href: canonical },
        { rel: "alternate", hrefLang: "fr", href: canonical },
        { rel: "alternate", hrefLang: "en", href: alternate },
        { rel: "alternate", hrefLang: "x-default", href: alternate },
      ],
      scripts: [{ type: "application/ld+json", children: jsonLd(loaderData) }],
    };
  },
  component: TourRouteComponent,
});

function TourRouteComponent() {
  return <DynamicTourPage tour={Route.useLoaderData()} />;
}

