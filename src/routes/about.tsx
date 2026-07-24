import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Compass,
  HeartHandshake,
  Languages,
  Laptop,
  MapPin,
  Network,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import aboutCss from "../about.css?url";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { TravelerReviewsSection } from "../components/TravelerReviewsSection";
import { TravelIdeasSection } from "../components/TravelIdeasSection";
import destinationDetailCss from "../destination-detail.css?url";
import { SiteLocaleProvider } from "../i18n";
import { SITE_NAME, SITE_URL } from "../lib/site";

const images = {
  hero: "https://images.unsplash.com/photo-1753172512618-92e65807c52d?auto=format&fit=crop&w=2200&q=82",
  approach:
    "https://images.unsplash.com/photo-1742500484373-d58e29f13418?auto=format&fit=crop&w=1400&q=82",
  local:
    "https://images.unsplash.com/photo-1733413231983-2880fe421619?auto=format&fit=crop&w=1400&q=82",
  lake: "https://images.unsplash.com/photo-1689517686555-516fca15b625?auto=format&fit=crop&w=1200&q=80",
  alfred: "/about/alfred-founder.jpg",
};

const heroFeatures = [
  { number: "01", title: "Personal by design", detail: "Your pace, interests and expectations" },
  { number: "02", title: "Rooted in Albania", detail: "Local knowledge, lived firsthand" },
  { number: "03", title: "Effortlessly supported", detail: "Clear, thoughtful and human" },
];

const visionFeatures: Array<{
  title: string;
  copy: string;
  icon: LucideIcon;
}> = [
  {
    title: "Better local visibility",
    copy: "Bring remarkable local places, people and experiences into clearer view.",
    icon: MapPin,
  },
  {
    title: "Useful technology",
    copy: "Make discovery, planning and support simpler without losing the human connection.",
    icon: Laptop,
  },
  {
    title: "Stronger local networks",
    copy: "Grow with trusted guides, hosts and partners who care about how Albania is experienced.",
    icon: Network,
  },
  {
    title: "Tourism with care",
    copy: "Create lasting value for travelers, communities and the places that welcome them.",
    icon: HeartHandshake,
  },
];

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/weblogo.png`,
      foundingDate: "2025",
      founder: {
        "@type": "Person",
        name: "Alfred Cekja",
        jobTitle: "Founder & Lead Guide",
      },
      description:
        "Wonder Albania combines firsthand local expertise with thoughtful technology to create personal journeys across Albania.",
    },
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#about-page`,
      url: `${SITE_URL}/about`,
      name: `About ${SITE_NAME}`,
      description:
        "Meet Wonder Albania founder and lead guide Alfred Cekja and discover the experience and vision behind the agency.",
      about: { "@id": `${SITE_URL}/#organization` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
  ],
}).replace(/</g, "\\u003c");

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Wonder Albania | People Who Know It Personally" },
      {
        name: "description",
        content:
          "Meet Wonder Albania founder and lead guide Alfred Cekja and discover the experience and vision behind the agency.",
      },
      {
        property: "og:title",
        content: "About Wonder Albania | People Who Know It Personally",
      },
      {
        property: "og:description",
        content: "More than a decade of firsthand guiding experience across Albania.",
      },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:image", content: `${SITE_URL}${images.alfred}` },
      {
        property: "og:image:alt",
        content: "Alfred Cekja leading a hiking group in the Albanian mountains",
      },
      { property: "og:locale", content: "en_US" },
      {
        name: "twitter:title",
        content: "About Wonder Albania | People Who Know It Personally",
      },
      {
        name: "twitter:description",
        content: "More than a decade of firsthand guiding experience across Albania.",
      },
      { name: "twitter:image", content: `${SITE_URL}${images.alfred}` },
    ],
    links: [
      { rel: "stylesheet", href: destinationDetailCss },
      { rel: "stylesheet", href: aboutCss },
      { rel: "canonical", href: `${SITE_URL}/about` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/about` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/about` },
    ],
    scripts: [{ type: "application/ld+json", children: jsonLd }],
  }),
  component: AboutRoute,
});

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
              alt="Green mountains and a river valley in Valbona, Albania"
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
              <h1 id="about-title">By people who know it personally.</h1>
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
          <div className="overview-grid about-overview-grid">
            <p className="lead-copy">
              Wonder Albania exists to offer a different kind of experience: one where the journey
              reflects the person taking it. We focus not only on what a tour includes, but on how
              it feels from the moment a destination is discovered to the memory that returns long
              after homecoming.
            </p>
          </div>
          <div className="gallery-section about-story-gallery" aria-label="Albania travel moments">
            <div className="gallery-large">
              <img
                src={images.approach}
                alt="Travelers exploring the Albanian countryside"
                loading="lazy"
              />
            </div>
            <div>
              <img
                src={images.local}
                alt="A green Albanian valley with mountains in the distance"
                loading="lazy"
              />
            </div>
            <div>
              <img
                src={images.lake}
                alt="An Albanian lake surrounded by green mountains"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="tour-container about-origin-section" aria-labelledby="origin-title">
          <div className="destination-stack-intro section-heading">
            <span className="eyebrow">The people and purpose behind the journey</span>
            <h2 id="origin-title">Experience on the ground. A clearer vision ahead.</h2>
          </div>

          <div className="destination-story-stack">
            <article className="destination-story-card destination-story-card-one">
              <div className="destination-story-media">
                <img
                  src={images.approach}
                  alt="A journey through the Albanian countryside"
                  loading="lazy"
                />
              </div>
              <div className="destination-story-copy">
                <div className="section-heading">
                  <span className="eyebrow">Our agency</span>
                  <h3>Built from experience. Reintroduced with greater purpose.</h3>
                  <p>
                    Our founders bring more than 10 years of experience guiding, planning and
                    supporting journeys across Albania. That knowledge shaped an agency founded in
                    2025 as Albatross.
                  </p>
                </div>
                <p>
                  The agency later became Wonder Albania, with a more serious drive to deliver
                  better experiences and a stronger priority on visibility and technology. The name
                  changed, but the foundation remains the same: real local knowledge, dependable
                  relationships and personal care on every journey.
                </p>
              </div>
            </article>

            <article className="destination-story-card destination-story-card-two">
              <div className="destination-story-copy">
                <div className="section-heading">
                  <span className="eyebrow">The person behind the journey</span>
                  <h3>Meet Alfred.</h3>
                  <p>
                    Behind Wonder Albania is real experience on the ground. Alfred, our lead guide,
                    brings over 10 years of hands-on guiding across Albania, from the remote trails
                    of the north to the historic cities of the south. Fluent in multiple languages
                    including English, French, Italian, Arabic, and Turkish, he has guided travelers
                    from all over the world, adapting each experience to their culture and
                    expectations.
                  </p>
                </div>
                <p>
                  His deep knowledge of the country, combined with a strong network of local
                  partners and guides, ensures that every trip runs smoothly, feels personal, and
                  goes far beyond the typical tourist experience.
                </p>
                <div className="about-alfred-facts" aria-label="Alfred's experience">
                  <span>
                    <Compass size={18} aria-hidden="true" /> 10+ years guiding
                  </span>
                  <span>
                    <Languages size={18} aria-hidden="true" /> Five languages
                  </span>
                  <span>
                    <UsersRound size={18} aria-hidden="true" /> Trusted local network
                  </span>
                </div>
              </div>
              <div className="destination-story-media about-founder-media">
                <img
                  src={images.alfred}
                  alt="Alfred Cekja leading a hiking group through the Albanian mountains"
                  loading="lazy"
                />
                <span className="about-founder-label">Alfred Cekja — Founder &amp; Lead Guide</span>
              </div>
            </article>

            <article className="destination-story-card destination-story-card-three about-vision-card">
              <div className="about-vision-visual" aria-hidden="true">
                <Sparkles size={34} strokeWidth={1.4} />
                <strong>
                  Better tourism.
                  <br />
                  Better experiences.
                </strong>
                <span>For travelers, communities and Albania.</span>
              </div>
              <div className="destination-story-copy">
                <div className="section-heading">
                  <span className="eyebrow">Our vision</span>
                  <h3>Help shape a better kind of tourism.</h3>
                  <p>
                    We want Albania to be experienced with more depth, care and confidence. That
                    means helping travelers find what is genuine, giving excellent local partners
                    stronger visibility, and using technology to make every step clearer.
                  </p>
                </div>
                <div className="about-vision-features">
                  {visionFeatures.map(({ title, copy, icon: Icon }) => (
                    <div key={title}>
                      <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                      <h4>{title}</h4>
                      <p>{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <TravelerReviewsSection className="about-traveler-reviews" />
        <TravelIdeasSection className="about-ideas" />
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
