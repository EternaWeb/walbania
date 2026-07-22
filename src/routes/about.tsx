import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bus,
  Compass,
  HeartHandshake,
  Hotel,
  SlidersHorizontal,
  Sparkles,
  Star,
  UtensilsCrossed,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import aboutCss from "../about.css?url";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { SiteLocaleProvider } from "../i18n";

const SITE_URL = "https://wonderalbania.com";

const images = {
  hero: "https://images.unsplash.com/photo-1753172512618-92e65807c52d?auto=format&fit=crop&w=2200&q=82",
  approach:
    "https://images.unsplash.com/photo-1742500484373-d58e29f13418?auto=format&fit=crop&w=1400&q=82",
  local:
    "https://images.unsplash.com/photo-1733413231983-2880fe421619?auto=format&fit=crop&w=1400&q=82",
  hikers:
    "https://images.unsplash.com/photo-1742500484373-d58e29f13418?auto=format&fit=crop&w=1200&q=80",
  lake: "https://images.unsplash.com/photo-1689517686555-516fca15b625?auto=format&fit=crop&w=1200&q=80",
  mist: "https://images.unsplash.com/photo-1637567068269-df5225247a79?auto=format&fit=crop&w=1200&q=80",
  rafting:
    "https://images.unsplash.com/photo-1642933196504-62107dac9258?auto=format&fit=crop&w=1200&q=80",
};

const heroFeatures = [
  { number: "01", title: "Personal by design", detail: "Your pace, interests and expectations" },
  { number: "02", title: "Rooted in Albania", detail: "Local knowledge, lived firsthand" },
  { number: "03", title: "Effortlessly supported", detail: "Clear, thoughtful and human" },
];

const principles: Array<{
  number: string;
  title: string;
  copy: string;
  icon: LucideIcon;
}> = [
  {
    number: "01",
    title: "Flexible, not rigid",
    copy: "No two travelers are the same. We leave room for the moments, needs and changes that make a journey truly yours.",
    icon: SlidersHorizontal,
  },
  {
    number: "02",
    title: "Quality you can feel",
    copy: "We choose places, routes and services for their consistency, reliability and genuine value—not for luxury alone.",
    icon: BadgeCheck,
  },
  {
    number: "03",
    title: "Details that matter",
    copy: "The pacing of a day, the comfort of a stop and the ease of each transfer shape how the whole trip is remembered.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Respect for place",
    copy: "We aim to support local communities, care for the places we visit and preserve the authenticity that makes Albania unique.",
    icon: HeartHandshake,
  },
];

const balances = [
  ["Local", "Professional"],
  ["Modern", "Human"],
  ["Flexible", "Reliable"],
  ["Simple", "Carefully crafted"],
];

const reviews = [
  {
    name: "Maya R.",
    country: "United Kingdom",
    trip: "Couples journey",
    quote:
      "The pace felt completely natural. We always knew what came next, but nothing about the trip felt over-planned.",
  },
  {
    name: "Jonas K.",
    country: "Germany",
    trip: "Family journey",
    quote:
      "Every transfer was easy, every recommendation felt personal, and the small local stops became our favorite memories.",
  },
  {
    name: "Claire D.",
    country: "France",
    trip: "Private itinerary",
    quote:
      "We felt looked after without ever feeling managed. Albania unfolded at exactly the right rhythm for us.",
  },
  {
    name: "Nina S.",
    country: "Netherlands",
    trip: "Friends journey",
    quote:
      "The local knowledge changed everything—from the quiet roads to the family-run places we would never have found alone.",
  },
];

const partnerCategories: Array<{ label: string; note: string; icon: LucideIcon }> = [
  { label: "Boutique stays", note: "Independent hospitality", icon: Hotel },
  { label: "Local guides", note: "Knowledge from within", icon: Compass },
  { label: "Transport partners", note: "Reliable connections", icon: Bus },
  { label: "Community hosts", note: "Genuine local welcome", icon: UsersRound },
  { label: "Experience makers", note: "Food, craft and culture", icon: UtensilsCrossed },
];

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "WonderAlbania",
      alternateName: "Wonder Albania",
      url: SITE_URL,
      logo: `${SITE_URL}/weblogo.png`,
      description:
        "Thoughtful Albania journeys shaped by local knowledge, clear planning and personal support.",
    },
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#about-page`,
      url: `${SITE_URL}/about`,
      name: "About Wonder Albania",
      description:
        "Meet Wonder Albania and discover our personal, locally rooted approach to thoughtfully crafted travel.",
      about: { "@id": `${SITE_URL}/#organization` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
  ],
}).replace(/</g, "\\u003c");

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Wonder Albania | Travel, Made Personal" },
      {
        name: "description",
        content:
          "Meet Wonder Albania and discover our personal, locally rooted approach to thoughtfully crafted travel.",
      },
      { property: "og:title", content: "About Wonder Albania | Travel, Made Personal" },
      {
        property: "og:description",
        content: "Local knowledge, modern service and Albania journeys shaped around you.",
      },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:image", content: images.hero },
      {
        property: "og:image:alt",
        content: "Wonder Albania — local and professional, modern and human",
      },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:title", content: "About Wonder Albania | Travel, Made Personal" },
      {
        name: "twitter:description",
        content: "Local knowledge, modern service and Albania journeys shaped around you.",
      },
      { name: "twitter:image", content: images.hero },
    ],
    links: [
      { rel: "stylesheet", href: aboutCss },
      { rel: "canonical", href: `${SITE_URL}/about` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/about` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/about` },
    ],
    scripts: [{ type: "application/ld+json", children: jsonLd }],
  }),
  component: AboutRoute,
});

function ReviewRail() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!viewport || paused || reduceMotion.matches) return;

    let frame = 0;
    let lastTime = performance.now();
    const move = (time: number) => {
      const elapsed = Math.min(time - lastTime, 40);
      lastTime = time;
      viewport.scrollLeft += elapsed * 0.025;
      const loopPoint = viewport.scrollWidth / 2;
      if (viewport.scrollLeft >= loopPoint) viewport.scrollLeft -= loopPoint;
      frame = window.requestAnimationFrame(move);
    };

    frame = window.requestAnimationFrame(move);
    return () => window.cancelAnimationFrame(frame);
  }, [paused]);

  const scrollReviews = (direction: number) => {
    viewportRef.current?.scrollBy({ left: direction * 380, behavior: "smooth" });
  };

  return (
    <section
      id="reviews"
      className="related-section about-review-section"
      aria-labelledby="reviews-title"
    >
      <div className="tour-container">
        <div className="related-panel">
          <div className="about-heading-row">
            <div className="section-heading">
              <span className="eyebrow">Traveler perspectives</span>
              <h2 id="reviews-title">Journeys that feel personal</h2>
              <p>
                Sample review presentation. Verified traveler stories will replace this preview
                content.
              </p>
            </div>
            <div className="highlight-controls" aria-label="Review controls">
              <button
                type="button"
                onClick={() => scrollReviews(-1)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                aria-label="Previous reviews"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollReviews(1)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                aria-label="Next reviews"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div
            ref={viewportRef}
            className="about-review-viewport scroll-hide"
            tabIndex={0}
            aria-label="Traveler review carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
            }}
          >
            <div className="about-review-track">
              {[...reviews, ...reviews].map((review, index) => {
                const duplicate = index >= reviews.length;
                return (
                  <article
                    key={`${review.name}-${index}`}
                    className="review-card about-review-card"
                    aria-hidden={duplicate || undefined}
                  >
                    <div className="review-top">
                      <span className="avatar" aria-hidden="true">
                        {review.name.slice(0, 1)}
                      </span>
                      <div>
                        <strong>{review.name}</strong>
                        <span>{review.country}</span>
                      </div>
                    </div>
                    <div className="stars" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star key={star} size={13} fill="currentColor" aria-hidden="true" />
                      ))}
                    </div>
                    <p>“{review.quote}”</p>
                    <span>{review.trip} · Sample review</span>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="about-page tour-page min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="index-hero-shell about-index-hero" aria-labelledby="about-title">
          <div className="index-hero-media">
            <img
              className="index-hero-poster"
              src={images.hero}
              alt="Green mountains and a river valley in Valbonë, Albania"
              fetchPriority="high"
            />
            <span className="index-hero-film" aria-hidden="true" />
            <div className="index-hero-copy">
              <a className="index-hero-cta" href="#our-story">
                <span className="index-hero-cta-label">About Wonder Albania</span>
                <span className="index-hero-cta-arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
              <h1 id="about-title">Local and professional. Modern and human.</h1>
              <p className="about-hero-intro">
                We treat travelers as guests, shaping each journey around their pace, interests and
                expectations—not moving them through a fixed system.
              </p>
            </div>
          </div>

          <div className="index-hero-features" aria-label="Why travel with Wonder Albania">
            {heroFeatures.map((feature) => (
              <div className="index-hero-feature" key={feature.number}>
                <span className="index-hero-feature-number">{feature.number}</span>
                <div>
                  <h2>{feature.title}</h2>
                  <p>{feature.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="our-story"
          className="tour-container content-section about-overview"
          aria-labelledby="story-title"
        >
          <div className="section-heading">
            <span className="eyebrow">Our approach</span>
            <h2 id="story-title">Travel should feel personal, natural and effortless.</h2>
          </div>
          <div className="overview-grid">
            <p className="lead-copy">
              Wonder Albania exists to offer a different kind of experience: one where the journey
              reflects the person taking it. We focus not only on what a tour includes, but on how
              it feels from the moment a destination is discovered to the memory that returns long
              after homecoming.
            </p>
            <div className="overview-copy">
              <p>
                Simplicity, clarity and attention to detail make better journeys. That means useful
                information before booking, smooth logistics on the road, and thoughtful adjustments
                whenever the day calls for them.
              </p>
              <p>
                Everything should feel under control without becoming intrusive, so the experience
                stays natural from discovery to the final memory.
              </p>
            </div>
          </div>
          <div className="gallery-section about-story-gallery" aria-label="Albania travel moments">
            <div className="gallery-large">
              <img
                src={images.approach}
                alt="Travelers walking toward a stone building in the Albanian countryside"
                loading="lazy"
              />
            </div>
            <div>
              <img
                src={images.local}
                alt="A green Albanian valley with Dajti mountain in the distance"
                loading="lazy"
              />
            </div>
            <div>
              <img
                src={images.lake}
                alt="Lake Shkodra surrounded by green mountains"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section
          className="tour-container content-section about-knowledge-section"
          aria-labelledby="knowledge-title"
        >
          <div className="related-panel about-knowledge-panel">
            <div className="about-knowledge-image">
              <img
                src={images.local}
                alt="A green Albanian valley with Dajti mountain in the distance"
                loading="lazy"
              />
            </div>
            <div className="about-knowledge-copy">
              <div className="section-heading">
                <span className="eyebrow">Local knowledge, modern service</span>
                <h2 id="knowledge-title">Grounded here. Designed for today.</h2>
              </div>
              <p>
                Our approach comes from real local expertise, shaped by years of guiding travelers
                across Albania and learning both the country and the people who arrive to explore
                it. That firsthand understanding helps us select places, routes and moments that
                genuinely belong in the journey.
              </p>
              <p>
                We pair that knowledge with clear organization, transparency and a well-designed
                digital experience. Travelers can find what they need without confusion while the
                human connection—the part that makes travel meaningful—always remains close.
              </p>
            </div>
          </div>
        </section>

        <section
          id="sustainability"
          className="tour-container content-section highlights-section about-principles"
          aria-labelledby="principles-title"
        >
          <div className="section-heading">
            <span className="eyebrow">What shapes every journey</span>
            <h2 id="principles-title">Care, built into the experience.</h2>
            <p>
              Quality is not luxury alone. It is the consistency, judgment and responsibility that
              make a trip feel easy from beginning to end.
            </p>
          </div>
          <div className="highlight-shell">
            <div className="highlight-track">
              {principles.map(({ number, title, copy, icon: Icon }) => (
                <article key={number} className="highlight-card about-principle-card">
                  <div className="highlight-icon">
                    <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                  </div>
                  <span className="about-principle-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="tour-container weather-card about-balance"
          aria-labelledby="balance-title"
        >
          <div>
            <span className="eyebrow">The Wonder Albania balance</span>
            <h2 id="balance-title">Genuine while it happens. Memorable long after.</h2>
            <div className="about-balance-list">
              {balances.map(([first, second]) => (
                <p key={first}>
                  <span>{first}</span>
                  <i>/</i>
                  <span>{second}</span>
                </p>
              ))}
            </div>
            <p>
              Simple yet carefully crafted, all working together so Albania feels genuine while it
              happens—and memorable long after it ends.
            </p>
          </div>
        </section>

        <ReviewRail />

        <section
          id="partners"
          className="tour-container content-section highlights-section about-partners"
          aria-labelledby="partners-title"
        >
          <div className="section-heading">
            <span className="eyebrow">Our trusted network</span>
            <h2 id="partners-title">The people behind a seamless journey</h2>
            <p>
              Great travel depends on strong local relationships. These temporary category marks
              show where approved partner brands will appear.
            </p>
          </div>
          <div className="highlight-shell">
            <div className="highlight-track about-partner-track">
              {partnerCategories.map(({ label, note, icon: Icon }) => (
                <article className="highlight-card about-partner-card" key={label}>
                  <div className="highlight-icon">
                    <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                  </div>
                  <h3>{label}</h3>
                  <p>{note}</p>
                </article>
              ))}
            </div>
          </div>
          <p className="about-partner-note">
            Partner names and logo assets will be added after approval.
          </p>
        </section>

        <section className="page-inset pb-14 about-not-sure" aria-labelledby="about-cta-title">
          <div className="about-not-sure-panel py-14 md:py-16 px-4 relative overflow-hidden">
            <p className="text-center text-white/80 text-sm">Made around you</p>
            <h2 id="about-cta-title" className="text-center text-white text-3xl md:text-5xl mt-1">
              Let’s shape your Albania.
            </h2>
            <div className="mt-10 relative marquee-mask" aria-hidden="true">
              <div className="marquee">
                <div className="marquee-track">
                  {[
                    images.hikers,
                    images.lake,
                    images.mist,
                    images.rafting,
                    images.hikers,
                    images.lake,
                    images.mist,
                    images.rafting,
                  ].map((src, index) => (
                    <div
                      className="marquee-item card-zoom overflow-hidden bg-white/20"
                      key={`${src}-${index}`}
                    >
                      <img
                        className="card-zoom-img w-full h-full object-cover"
                        src={src}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <a className="secondary-button" href="/tour">
                Plan your trip <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function AboutRoute() {
  return (
    <SiteLocaleProvider locale="en" alternatePaths={{ en: "/about" }}>
      <AboutPage />
    </SiteLocaleProvider>
  );
}
