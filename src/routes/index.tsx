import { createFileRoute } from "@tanstack/react-router";
import {
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Mountain,
  Users,
  Heart,
  Utensils,
  Waves,
  Sun,
  Tent,
  Camera,
  Award,
  ShieldCheck,
  Leaf,
  BadgeCheck,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Music2,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { SiteFooter as SharedSiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { DEFAULT_FAQS, FaqSection } from "../components/FaqSection";
import { SiteLocaleProvider, useLocalize, useSiteLocale } from "../i18n";
import type { SiteLocale } from "../i18n";
import { SITE_NAME, SITE_URL } from "../lib/site";

const websiteJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: ["en", "fr"],
}).replace(/</g, "\\u003c");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} — Discover Albania in Wonder` },
      {
        name: "description",
        content:
          "Curated Albania holidays: couples, family, hiking and summer escapes. All-inclusive deals and unforgettable experiences.",
      },
      { property: "og:title", content: `${SITE_NAME} — Discover Albania in Wonder` },
      { property: "og:site_name", content: SITE_NAME },
      {
        property: "og:description",
        content: "Curated Albania holidays: couples, family, hiking and summer escapes.",
      },
      { name: "twitter:title", content: `${SITE_NAME} — Discover Albania in Wonder` },
      {
        name: "twitter:description",
        content: "Curated Albania holidays, local experiences and unforgettable escapes.",
      },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "fr_FR" },
      { property: "og:url", content: "https://wonderalbania.com/" },
    ],
    links: [
      { rel: "canonical", href: "https://wonderalbania.com/" },
      { rel: "alternate", hrefLang: "en", href: "https://wonderalbania.com/" },
      { rel: "alternate", hrefLang: "fr", href: "https://wonderalbania.com/fr/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://wonderalbania.com/" },
    ],
    scripts: [{ type: "application/ld+json", children: websiteJsonLd }],
  }),
  component: () => <HomePage locale="en" />,
});

const HERO_POSTER = "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1800&q=80";
const HERO_VIDEO_DESKTOP = "/videos/hero-1080.mp4";
// Replace this with /videos/hero-720.mp4 when the mobile export is available.
const HERO_VIDEO_MOBILE = HERO_VIDEO_DESKTOP;

const agencyFeatures = [
  {
    number: "01",
    title: "Tailor-made journeys",
    detail: "Designed around you",
  },
  {
    number: "02",
    title: "Albanian expertise",
    detail: "Local knowledge, firsthand",
  },
  {
    number: "03",
    title: "With you all the way",
    detail: "Personal support, 24/7",
  },
];

const collections = [
  {
    label: "Couples Travel",
    img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
    ribbon: null,
    icon: Heart,
    detail: "Private stays · Made for two",
    description:
      "Slow coastal days, romantic hideaways and thoughtful experiences designed for two.",
  },
  {
    label: "Family Travel",
    img: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
    ribbon: "Popular",
    icon: Users,
    detail: "Flexible days · All ages",
    description:
      "Easy-paced itineraries with family-friendly stays, transfers and memorable activities.",
  },
  {
    label: "Hiking",
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    ribbon: null,
    icon: Mountain,
    detail: "Guided routes · Local experts",
    description:
      "Walk Albania's wildest trails with expert guides, characterful lodges and luggage support.",
  },
  {
    label: "Summer Secrets",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ribbon: "New",
    icon: Sun,
    detail: "Hidden coast · Local access",
    description:
      "Quiet coves, small seaside towns and warm summer evenings away from the obvious routes.",
  },
];

const deals = [
  {
    img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    ribbon: "-20%",
  },
  { img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", ribbon: null },
  { img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80", ribbon: "Hot" },
  { img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", ribbon: null },
  { img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80", ribbon: null },
  {
    img: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600&q=80",
    ribbon: "-15%",
  },
];

const experiences = [
  {
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    icon: Mountain,
    label: "Alpine Hiking Day",
  },
  {
    img: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&q=80",
    icon: Utensils,
    label: "Local Food Tour",
  },
  {
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
    icon: Tent,
    label: "Wild Camping",
  },
  {
    img: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&q=80",
    icon: Waves,
    label: "Riviera Sailing",
  },
  {
    img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80",
    icon: Camera,
    label: "Old Town Photo Walk",
  },
  {
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80",
    icon: Sun,
    label: "Beach Escape",
  },
];

const ideaImgs = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500&q=80",
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&q=80",
  "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=500&q=80",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=500&q=80",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=500&q=80",
];

const travelerStories = [
  {
    quote:
      "A brilliant first Wonder Albania trip, with a perfect mix of relaxing, cultural and adventure activities.",
    author: "Andre, France",
    photos: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=82",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=82",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=82",
    ],
  },
  {
    quote:
      "Every day felt personal and effortless. The mountain guide and family lunch were unforgettable.",
    author: "Mia, Germany",
    photos: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=82",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=82",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=82",
    ],
  },
  {
    quote:
      "We saw a side of the Riviera we would never have found alone, without ever feeling rushed.",
    author: "Sophie, United Kingdom",
    photos: [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=82",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=82",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=82",
    ],
  },
  {
    quote:
      "Thoughtful planning, warm local hosts and just the right amount of adventure for our family.",
    author: "Elena, Italy",
    photos: [
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=82",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=82",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=82",
    ],
  },
];

// ---- Horizontal scroller with smart arrows (desktop only) ----
function Scroller({ children }: { children: React.ReactNode[] }) {
  const localize = useLocalize();
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: number) => {
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  };

  return localize(
    <div className="relative">
      <div ref={ref} className="flex gap-5 overflow-x-auto snap-x px-4 md:px-8 scroll-hide">
        {children.map((c, i) => (
          <div key={i} className="index-scroller-item flex-shrink-0 snap-start">
            {c}
          </div>
        ))}
      </div>

      {canLeft && (
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="hidden md:flex arrow-btn absolute left-2 top-1/2 -translate-y-1/2"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {canRight && (
        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="hidden md:flex arrow-btn absolute right-2 top-1/2 -translate-y-1/2"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>,
  );
}

function TravelersLoveUs() {
  const locale = useSiteLocale();
  const localize = useLocalize();
  const [storyIndex, setStoryIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const story = travelerStories[storyIndex];

  useEffect(() => {
    let changeTimer: ReturnType<typeof setTimeout> | undefined;
    const interval = window.setInterval(() => {
      setIsChanging(true);
      changeTimer = window.setTimeout(() => {
        setStoryIndex((current) => (current + 1) % travelerStories.length);
        setIsChanging(false);
      }, 320);
    }, 4000);

    return () => {
      window.clearInterval(interval);
      if (changeTimer) window.clearTimeout(changeTimer);
    };
  }, []);

  return localize(
    <section className="page-inset pb-14 md:pb-20" id="reviews">
      <div
        className="mx-auto py-14 md:py-16 px-6"
        style={{ background: "#CCDAB8", borderRadius: 2 }}
      >
        <h2 className="text-center text-3xl md:text-4xl">
          {locale === "fr" ? "Nos voyageurs nous adorent" : "Travelers Love Us"}
        </h2>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className={`tly-stack${isExpanded ? " is-expanded" : ""}${
              isChanging ? " is-changing" : ""
            }`}
            aria-label={isExpanded ? "Close traveler photos" : "Open traveler photos"}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {story.photos.map((src, i) => (
              <div key={`${storyIndex}-${src}`} className={`tly-card tly-card-${i}`}>
                <img
                  src={src}
                  alt={`Traveler moment ${i + 1} from ${story.author}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </button>
        </div>

        <p
          className={`tly-review text-center mt-8 max-w-xl mx-auto text-sm md:text-base font-italic-inter${
            isChanging ? " is-changing" : ""
          }`}
          aria-live="polite"
        >
          “{story.quote}” <span className="not-italic">— {story.author}</span>
        </p>
        <div className="flex justify-center mt-6">
          <button className="btn-brand" style={{ background: "#1F2528", color: "white" }}>
            Read Reviews
          </button>
        </div>
      </div>
    </section>,
  );
}

function Card({
  img,
  title,
  price,
  ribbon,
}: {
  img: string;
  title: string;
  price: string;
  ribbon?: string | null;
}) {
  const localize = useLocalize();
  return localize(
    <div className="card-zoom px-2">
      <div
        className="relative w-full overflow-hidden bg-muted"
        style={{ borderRadius: 10, aspectRatio: "1/1" }}
      >
        <img src={img} alt="" className="card-zoom-img w-full h-full object-cover" />
        {ribbon && <span className="ribbon">{ribbon}</span>}
      </div>
      <a href="#" className="mt-3 block text-sm">
        {title}
      </a>
      <p className="text-sm text-muted-foreground">{price}</p>
    </div>,
  );
}

function CollectionCard({
  label,
  img,
  ribbon,
  icon: Icon,
  detail,
  description,
}: {
  label: string;
  img: string;
  ribbon: string | null;
  icon: LucideIcon;
  detail: string;
  description: string;
}) {
  const localize = useLocalize();
  return localize(
    <article className="collection-card">
      <div className="collection-card-media">
        <img src={img} alt={label} className="card-zoom-img w-full h-full object-cover" />
        {ribbon && <span className="ribbon">{ribbon}</span>}
        <div className="collection-card-overlay">
          <span className="collection-card-icon">
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <span className="collection-card-detail">{detail}</span>
          <h3>{label}</h3>
          <p>{description}</p>
          <a href="#" className="collection-card-button">
            Explore
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
      <a href="#" className="collection-card-mobile-label">
        {label}
      </a>
    </article>,
  );
}

function NotSure() {
  const localize = useLocalize();
  const openIdea = () => {
    /* same as button */ window.location.hash = "#get-ideas";
  };
  return localize(
    <section className="page-inset pb-14">
      <div
        className="py-14 md:py-16 px-4 relative overflow-hidden"
        style={{ background: "#1F2528", borderRadius: 2 }}
      >
        <p className="text-center text-white/80 text-sm">Get wonderful ideas</p>
        <h2 className="text-center text-white text-3xl md:text-5xl mt-1">Not sure where to go?</h2>

        <div className="mt-10 relative marquee-mask">
          <div className="marquee group">
            <div className="marquee-track">
              {[...ideaImgs, ...ideaImgs].map((src, i) => (
                <button
                  key={i}
                  onClick={openIdea}
                  className="marquee-item card-zoom overflow-hidden bg-white/20"
                  style={{ borderRadius: 10 }}
                  aria-label="Get ideas"
                >
                  <img src={src} alt="" className="card-zoom-img w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button id="get-ideas" className="btn-brand">
            Get Ideas
          </button>
        </div>
      </div>
    </section>,
  );
}

function LegacySiteFooter() {
  const localize = useLocalize();
  return localize(
    <footer className="bg-white border-t" style={{ borderColor: "#E5E7EB" }}>
      {/* Newsletter band */}
      <div className="page-inset py-12 border-b" style={{ borderColor: "#E5E7EB" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">
              Join the Wonder Albania newsletter
            </h3>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Fresh itineraries, insider tips, and members-only deals — once a month.
            </p>
          </div>
          <form className="flex gap-2 w-full">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-[2px] border text-sm outline-none focus:border-[#1F2528]"
              style={{ borderColor: "#E5E7EB" }}
            />
            <button
              type="submit"
              className="btn-brand"
              style={{ background: "#1F2528", color: "white" }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="page-inset py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-10 text-sm">
          <div className="col-span-2">
            <img src="/weblogo.png" alt="Wonder Albania" className="h-7 w-auto mb-4" />
            <p className="text-muted-foreground max-w-xs">
              Curated Albania holidays. We design, book and support every journey with local experts
              on the ground.
            </p>
            <div className="mt-5 space-y-2 text-muted-foreground">
              <p>Rr. Deshmoret e 4 Shkurtit, Tirana, Albania</p>
              <p>
                <a href="mailto:hello@wonderalbania.com" className="hover:text-[#1F2528]">
                  hello@wonderalbania.com
                </a>
              </p>
              <p>
                <a href="tel:+355692290036" className="hover:text-[#1F2528]">
                  +355 692290036
                </a>
              </p>
              <p>
                <a href="tel:0682778037" className="hover:text-[#1F2528]">
                  0682778037
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Offers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Experiences
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Group Travel
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Travel Insurance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Booking Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Cancellations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  GDPR
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1F2528]">
                  Modern Slavery
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Certifications */}
        <div className="max-w-6xl mx-auto mt-14 pt-10 border-t" style={{ borderColor: "#E5E7EB" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-5 text-center md:text-left">
            Certifications & Memberships
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            {[
              { label: "IATA Accredited", icon: Award },
              { label: "ATTA Member", icon: Globe },
              { label: "ABTOT Protected", icon: ShieldCheck },
              { label: "Travelife Certified", icon: Leaf },
              { label: "ISO 9001:2015", icon: BadgeCheck },
            ].map(({ label, icon: I }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-[2px] border text-xs text-muted-foreground"
                style={{ borderColor: "#E5E7EB" }}
              >
                <I size={14} className="text-[#1F2528]" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: "#E5E7EB" }}>
        <div className="page-inset py-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Wonder Albania sh.p.k. — Registered No. K12345678L. All
              rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="icon-chip"
                style={{ width: 34, height: 34 }}
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="icon-chip"
                style={{ width: 34, height: 34 }}
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="icon-chip"
                style={{ width: 34, height: 34 }}
              >
                <Youtube size={16} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="icon-chip"
                style={{ width: 34, height: 34 }}
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="icon-chip"
                style={{ width: 34, height: 34 }}
              >
                <Music2 size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>,
  );
}

function LazyHeroVideo({ children }: { children?: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loadVideo = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      setVideoSrc(isMobile ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP);
    };

    if (!("IntersectionObserver" in window)) {
      loadVideo();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        loadVideo();
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoSrc) return;
    videoRef.current?.load();
  }, [videoSrc]);

  const revealVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsReady(true);
    void video.play().catch(() => {
      // The poster remains visible if a browser blocks autoplay.
    });
  };

  return (
    <div className="index-hero-media">
      <img
        src={HERO_POSTER}
        alt="Discover Albania"
        className="index-hero-poster"
        loading="eager"
        fetchPriority="high"
      />
      <video
        ref={videoRef}
        className={`index-hero-video${isReady ? " is-ready" : ""}`}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        poster={HERO_POSTER}
        aria-hidden="true"
        tabIndex={-1}
        onCanPlayThrough={revealVideo}
      >
        {videoSrc && <source src={videoSrc} type="video/mp4" />}
      </video>
      <span className="index-hero-film" aria-hidden="true" />
      {children}
    </div>
  );
}

function Index() {
  const locale = useSiteLocale();
  const localize = useLocalize();
  const [selectedKind, setSelectedKind] = useState("Hiking Alps");
  const [selectedGroup, setSelectedGroup] = useState("Family");
  return localize(
    <div className="index-page min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="index-hero-shell" aria-labelledby="index-hero-title">
        <LazyHeroVideo>
          <div className="index-hero-copy">
            <a className="index-hero-cta" href="#holiday-collections">
              <span className="index-hero-cta-label">Experience Albania</span>
              <span className="index-hero-cta-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
            <h1 id="index-hero-title">Beyond the Ordinary.</h1>
          </div>
        </LazyHeroVideo>

        <div className="index-hero-features" aria-label="Why travel with Wonder Albania">
          {agencyFeatures.map((feature) => (
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

      {/* Our Holiday Collections */}
      <section id="holiday-collections" className="page-inset py-14 md:py-20">
        <h2 className="text-center text-3xl md:text-4xl mb-8 md:mb-12">
          {locale === "fr" ? "Nos collections de séjours" : "Our Holiday Collections"}
        </h2>
        <div className="collection-desktop-grid hidden md:grid grid-cols-4 gap-4">
          {collections.map((c) => (
            <CollectionCard key={c.label} {...c} />
          ))}
        </div>
        <div className="md:hidden flex gap-4 overflow-x-auto scroll-hide snap-x -mx-4 px-4">
          {collections.map((c) => (
            <div key={c.label} className="flex-shrink-0 snap-start w-[64%]">
              <CollectionCard {...c} />
            </div>
          ))}
        </div>
      </section>

      <TravelersLoveUs />

      {/* All Inclusive Deals */}
      <section className="py-6 md:py-10 page-max">
        <h2 className="text-center text-3xl md:text-4xl mb-8 md:mb-10">All Inclusive Deals</h2>
        <Scroller>
          {deals.map((d, i) => (
            <Card
              key={i}
              img={d.img}
              title="Melia Hotel 7 Days All Inclusive"
              price="$356 per person"
              ribbon={d.ribbon}
            />
          ))}
        </Scroller>
      </section>

      {/* Experiences for you */}
      <section className="py-14 md:py-20 page-max">
        <h2 className="text-center text-3xl md:text-4xl mb-8">Experiences for you</h2>
        <div className="experience-filters max-w-3xl mx-auto">
          <div className="experience-filter-row">
            <span className="experience-filter-label">What kind?</span>
            <div className="experience-filter-scroll scroll-hide">
              {[
                { label: "Hiking Alps", Icon: Mountain },
                { label: "Beach", Icon: Waves },
                { label: "Cultural", Icon: Camera },
                { label: "Foodie", Icon: Utensils },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={selectedKind === label}
                  onClick={() => setSelectedKind(label)}
                  className={`experience-filter-pill${selectedKind === label ? " is-selected" : ""}`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="experience-filter-row">
            <span className="experience-filter-label">Who is going?</span>
            <div className="experience-filter-scroll scroll-hide">
              {[
                { label: "Family", Icon: Users },
                { label: "Couple", Icon: Heart },
                { label: "Friends", Icon: Sparkles },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={selectedGroup === label}
                  onClick={() => setSelectedGroup(label)}
                  className={`experience-filter-pill${selectedGroup === label ? " is-selected" : ""}`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Scroller>
            {experiences.map((e, i) => (
              <div key={i} className="card-zoom px-2">
                <div
                  className="w-full overflow-hidden bg-muted"
                  style={{ borderRadius: 10, aspectRatio: "1/1" }}
                >
                  <img src={e.img} alt="" className="card-zoom-img w-full h-full object-cover" />
                </div>
                <a href="#" className="mt-3 block text-sm text-black">
                  {e.label}
                </a>
                <p className="text-sm text-black/60">$356 per person</p>
              </div>
            ))}
          </Scroller>
        </div>
      </section>

      <NotSure />
      <FaqSection items={DEFAULT_FAQS} />
      <SharedSiteFooter />
    </div>,
  );
}

export function HomePage({ locale }: { locale: SiteLocale }) {
  return (
    <SiteLocaleProvider locale={locale}>
      <Index />
    </SiteLocaleProvider>
  );
}
