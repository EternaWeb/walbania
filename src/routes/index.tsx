import { createFileRoute } from "@tanstack/react-router";
import {
  Globe,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Mountain,
  Users,
  Heart,
  Utensils,
  Waves,
  Sun,
  Tent,
  Camera,
  ChevronDown,
  Award,
  ShieldCheck,
  Leaf,
  BadgeCheck,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Music2,
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { LocaleLocationModal } from "../components/LocaleLocationModal";
import { SiteMenu } from "../components/SiteMenu";
import { SiteLocaleProvider, useLocalize, useSiteLocale } from "../i18n";
import type { SiteLocale } from "../i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WonderAlbania — Discover Albania in Wonder" },
      {
        name: "description",
        content:
          "Curated Albania holidays: couples, family, hiking and summer escapes. All-inclusive deals and unforgettable experiences.",
      },
      { property: "og:title", content: "WonderAlbania — Discover Albania in Wonder" },
      {
        property: "og:description",
        content: "Curated Albania holidays: couples, family, hiking and summer escapes.",
      },
      { name: "twitter:title", content: "WonderAlbania — Discover Albania in Wonder" },
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
  }),
  component: () => <HomePage locale="en" />,
});

const HERO_POSTER = "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1800&q=80";
const HERO_VIDEO_DESKTOP = "/videos/hero-1080.mp4";
// Replace this with /videos/hero-720.mp4 when the mobile export is available.
const HERO_VIDEO_MOBILE = HERO_VIDEO_DESKTOP;

const collections = [
  {
    label: "Couples Travel",
    img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
    ribbon: null,
  },
  {
    label: "Family Travel",
    img: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
    ribbon: "Popular",
  },
  {
    label: "Hiking",
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    ribbon: null,
  },
  {
    label: "Summer Secrets",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ribbon: "New",
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

const testimonials = [
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
];

const faqs = [
  {
    q: "How do I book a trip with WonderAlbania?",
    a: "Choose a collection or deal, click through to the detail page, and follow the booking steps. Our team confirms every reservation within 24 hours.",
  },
  {
    q: "Are flights included in the packages?",
    a: "Most all-inclusive deals include stays, transfers and experiences. Flights are optional and can be added at checkout.",
  },
  {
    q: "Can I customize an itinerary?",
    a: "Yes — every experience can be tailored. Use the 'Not sure where to go?' section or contact us directly.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Free cancellation up to 30 days before departure on most bookings. Details are shown on each package.",
  },
  {
    q: "Do you offer group discounts?",
    a: "Groups of 6 or more receive automatic discounts. Reach out for tailored quotes.",
  },
];

// ---- Horizontal scroller with smart arrows (desktop only) ----
function Scroller({ children, itemClass }: { children: React.ReactNode[]; itemClass: string }) {
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
          <div
            key={i}
            className={`flex-shrink-0 snap-start w-[78%] sm:w-[45%] md:w-auto ${itemClass}`}
          >
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
  return localize(
    <section className="page-inset pb-14 md:pb-20">
      <div
        className="mx-auto py-14 md:py-16 px-6"
        style={{ background: "#E6E8FF", borderRadius: 20 }}
      >
        <h2 className="text-center text-3xl md:text-4xl">
          {locale === "fr" ? (
            "Nos voyageurs nous adorent"
          ) : (
            <>
              Travelers <em className="font-italic-inter">Love</em> Us
            </>
          )}
        </h2>

        <div className="mt-10 flex justify-center">
          <div className="tly-stack group">
            {testimonials.map((src, i) => (
              <div key={i} className={`tly-card tly-card-${i}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-8 max-w-xl mx-auto text-sm md:text-base font-italic-inter">
          "A brilliant first Original Travel trip, with a perfect mix of relaxing, cultural and
          adventure activities." <span className="not-italic">— Andre, France</span>
        </p>
        <div className="flex justify-center mt-6">
          <button className="btn-brand" style={{ background: "#434DFF", color: "white" }}>
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
        style={{ borderRadius: 20, aspectRatio: "1/1" }}
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
}: {
  label: string;
  img: string;
  ribbon: string | null;
}) {
  const localize = useLocalize();
  return localize(
    <div className="card-zoom px-2 flex flex-col items-center">
      <div
        className="relative w-full overflow-hidden"
        style={{ borderRadius: 20, aspectRatio: "3/4" }}
      >
        <img src={img} alt={label} className="card-zoom-img w-full h-full object-cover" />
        {ribbon && <span className="ribbon">{ribbon}</span>}
      </div>
      <a href="#" className="mt-3 text-sm">
        {label}
      </a>
    </div>,
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
        style={{ background: "#434DFF", borderRadius: 24 }}
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
                  style={{ borderRadius: 16 }}
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

function FAQ() {
  const locale = useSiteLocale();
  const localize = useLocalize();
  const [open, setOpen] = useState<number | null>(0);
  return localize(
    <section className="page-inset py-16 bg-white">
      <h2 className="text-center text-3xl md:text-4xl mb-10">
        {locale === "fr" ? (
          "Questions fréquentes"
        ) : (
          <>
            Frequently <em className="font-italic-inter">Asked</em> Questions
          </>
        )}
      </h2>
      <div className="max-w-3xl mx-auto divide-y" style={{ borderColor: "#E5E7EB" }}>
        {faqs.map((f, i) => (
          <div key={i} className="py-4">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="font-medium text-base md:text-lg">{f.q}</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>,
  );
}

function SiteFooter() {
  const localize = useLocalize();
  return localize(
    <footer className="bg-white border-t" style={{ borderColor: "#E5E7EB" }}>
      {/* Newsletter band */}
      <div className="page-inset py-12 border-b" style={{ borderColor: "#E5E7EB" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">
              Join the WonderAlbania newsletter
            </h3>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Fresh itineraries, insider tips, and members-only deals — once a month.
            </p>
          </div>
          <form className="flex gap-2 w-full">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full border text-sm outline-none focus:border-[#434DFF]"
              style={{ borderColor: "#E5E7EB" }}
            />
            <button
              type="submit"
              className="btn-brand"
              style={{ background: "#434DFF", color: "white" }}
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
            <img src="/weblogo.png" alt="WonderAlbania" className="h-7 w-auto mb-4" />
            <p className="text-muted-foreground max-w-xs">
              Curated Albania holidays. We design, book and support every journey with local experts
              on the ground.
            </p>
            <div className="mt-5 space-y-2 text-muted-foreground">
              <p>Rr. Deshmoret e 4 Shkurtit, Tirana, Albania</p>
              <p>
                <a href="mailto:hello@wonderalbania.com" className="hover:text-[#434DFF]">
                  hello@wonderalbania.com
                </a>
              </p>
              <p>
                <a href="tel:+355691234567" className="hover:text-[#434DFF]">
                  +355 69 123 45 67
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Offers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Experiences
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Group Travel
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Travel Insurance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Booking Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Cancellations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
                  GDPR
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#434DFF]">
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
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs text-muted-foreground"
                style={{ borderColor: "#E5E7EB" }}
              >
                <I size={14} className="text-[#434DFF]" />
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
              © {new Date().getFullYear()} WonderAlbania sh.p.k. — Registered No. K12345678L. All
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

function LazyHeroVideo() {
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
    </div>
  );
}

function Index() {
  const locale = useSiteLocale();
  const localize = useLocalize();
  return localize(
    <div className="min-h-screen bg-background text-foreground">
      {/* Top blue bar */}
      <div style={{ background: "#434DFF" }} className="w-full">
        <div className="page-inset py-2 text-xs">
          <a href="#" className="text-white underline underline-offset-2">
            Talk with Us
          </a>
        </div>
      </div>

      {/* Main nav */}
      <header className="page-inset py-4">
        <div className="flex items-center justify-between gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm flex-1">
            <a href="#" className="hover:text-[#434DFF]">
              About
            </a>
            <a href="#" className="hover:text-[#434DFF]">
              Offers
            </a>
            <a href="#" className="hover:text-[#434DFF]">
              Destinations
            </a>
          </nav>
          <div className="flex-1 md:flex md:justify-center">
            <a href="/" aria-label="WonderAlbania home">
              <img src="/weblogo.png" alt="WonderAlbania" className="h-6 md:h-7 w-auto" />
            </a>
          </div>
          <div className="flex items-center gap-[10px] flex-1 justify-end">
            <LocaleLocationModal />
            <button aria-label="Search" className="icon-chip">
              <Search size={18} />
            </button>
            <button aria-label="AI" className="icon-chip">
              <Sparkles size={18} fill="black" />
            </button>
            <SiteMenu />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-[10px] page-max">
        <LazyHeroVideo />
      </section>

      {/* Our Holiday Collections */}
      <section className="page-inset py-14 md:py-20">
        <h2 className="text-center text-3xl md:text-4xl mb-8 md:mb-12">
          {locale === "fr" ? (
            "Nos collections de séjours"
          ) : (
            <>
              Our <em className="font-italic-inter">Holiday</em> Collections
            </>
          )}
        </h2>
        <div className="hidden md:grid grid-cols-4 gap-5">
          {collections.map((c) => (
            <CollectionCard key={c.label} {...c} />
          ))}
        </div>
        <div className="md:hidden flex gap-4 overflow-x-auto scroll-hide snap-x -mx-4 px-4">
          {collections.map((c) => (
            <div key={c.label} className="flex-shrink-0 snap-start w-[70%]">
              <CollectionCard {...c} />
            </div>
          ))}
        </div>
      </section>

      <TravelersLoveUs />

      {/* All Inclusive Deals */}
      <section className="py-6 md:py-10 page-max">
        <h2 className="text-center text-3xl md:text-4xl mb-8 md:mb-10">All Inclusive Deals</h2>
        <Scroller itemClass="md:w-[19%]">
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
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">What kind?</span>
            {[
              { label: "Hiking Alps", Icon: Mountain },
              { label: "Beach", Icon: Waves },
              { label: "Cultural", Icon: Camera },
              { label: "Foodie", Icon: Utensils },
            ].map(({ label, Icon }) => (
              <button key={label} className="pill inline-flex items-center gap-1.5">
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Who is going?</span>
            {[
              { label: "Family", Icon: Users },
              { label: "Couple", Icon: Heart },
              { label: "Friends", Icon: Sparkles },
            ].map(({ label, Icon }) => (
              <button key={label} className="pill inline-flex items-center gap-1.5">
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Scroller itemClass="md:w-[19%]">
            {experiences.map((e, i) => (
              <div key={i} className="card-zoom px-2">
                <div
                  className="w-full overflow-hidden bg-muted"
                  style={{ borderRadius: 20, aspectRatio: "1/1" }}
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
      <FAQ />
      <SiteFooter />
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
