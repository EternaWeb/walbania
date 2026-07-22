import {
  ArrowRight,
  CalendarDays,
  Camera,
  ChevronDown,
  Clock3,
  Compass,
  Landmark,
  MapPin,
  Mountain,
  Navigation,
  Sparkles,
  Star,
  Sun,
  Utensils,
  Users,
} from "lucide-react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { SiteLocaleProvider } from "../../i18n";
import "../../destination-detail.css";

const images = {
  hero: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1800&q=88",
  castle: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=1000&q=84",
  oldTown: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&q=84",
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=84",
  river: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&q=84",
  hills: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1000&q=84",
};

const highlights = [
  {
    icon: Landmark,
    title: "Berat Castle",
    text: "Walk through a living citadel where stone lanes, Byzantine churches and family homes share the hilltop.",
  },
  {
    icon: Camera,
    title: "Mangalem quarter",
    text: "See the layered Ottoman houses that gave Berat its much-loved name: the city of a thousand windows.",
  },
  {
    icon: Utensils,
    title: "Table-to-table culture",
    text: "Taste slow-cooked local dishes, mountain herbs and wines made in the countryside surrounding the city.",
  },
  {
    icon: Mountain,
    title: "Tomorr landscapes",
    text: "Pair the old town with canyon walks, mountain viewpoints and quiet villages beyond the Osum valley.",
  },
] as const;

const areas = [
  {
    number: "01",
    name: "Mangalem",
    label: "For first-time visitors",
    text: "White Ottoman houses climb above the river in Berat's most recognisable neighbourhood. Stay here for stone lanes, cafes and easy walks to the castle.",
    image: images.oldTown,
  },
  {
    number: "02",
    name: "Gorica",
    label: "For a slower rhythm",
    text: "Cross the old bridge for leafy lanes, guesthouses and the classic view back toward Mangalem. Evenings feel calm and wonderfully local.",
    image: images.river,
  },
  {
    number: "03",
    name: "The castle quarter",
    label: "For history lovers",
    text: "Wake inside the ancient walls and explore before the day visitors arrive. Expect steep cobbles, wide views and a village atmosphere.",
    image: images.castle,
  },
] as const;

const packages = [
  {
    badge: "Most loved",
    image: images.castle,
    meta: "Full day · Small group",
    title: "Berat Old Town, Castle & family lunch",
    description:
      "A thoughtfully paced introduction to Berat with a local guide and a home-cooked lunch above the river.",
    rating: "4.9",
    reviews: "86 reviews",
    price: "€79",
  },
  {
    badge: "Food & wine",
    image: images.food,
    meta: "2 days · Private",
    title: "Berat flavours and vineyard escape",
    description:
      "Pair the UNESCO old town with a countryside winery, seasonal tastings and an overnight boutique stay.",
    rating: "4.8",
    reviews: "41 reviews",
    price: "€245",
  },
  {
    badge: "Active",
    image: images.hills,
    meta: "3 days · Small group",
    title: "Berat, Osum Canyon & Tomorr foothills",
    description:
      "Go beyond the city with canyon scenery, village hospitality and a guided walk through the surrounding landscape.",
    rating: "4.9",
    reviews: "33 reviews",
    price: "€389",
  },
] as const;

const faqs = [
  {
    question: "How many days should I spend in Berat?",
    answer:
      "Two nights is a lovely first visit: one day for the old town and castle, then another for a winery, canyon or countryside experience. A day trip works, but misses Berat's relaxed evenings.",
  },
  {
    question: "Is Berat easy to explore on foot?",
    answer:
      "The riverside neighbourhoods are compact and walkable. The castle climb is steep and cobbled, so comfortable shoes are essential; taxis can take you close to the upper entrance.",
  },
  {
    question: "Can Berat be combined with other destinations?",
    answer:
      "Yes. Berat fits naturally between Tirana and Gjirokastër, or as a cultural stop before the Albanian Riviera. Our multi-day packages can connect the route with private transport.",
  },
] as const;

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="destination-section-heading">
      <span className="destination-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function PackageCard({ tour }: { tour: (typeof packages)[number] }) {
  return (
    <article className="destination-package-card">
      <a href="/tour" className="destination-package-image" aria-label={`View ${tour.title}`}>
        <img src={tour.image} alt="" loading="lazy" decoding="async" />
        <span>{tour.badge}</span>
      </a>
      <div className="destination-package-copy">
        <span className="destination-package-meta">{tour.meta}</span>
        <h3>
          <a href="/tour">{tour.title}</a>
        </h3>
        <p>{tour.description}</p>
        <div className="destination-package-rating">
          <span>
            <Star size={15} fill="currentColor" /> {tour.rating}
          </span>
          <span>{tour.reviews}</span>
        </div>
        <div className="destination-package-footer">
          <span>
            From <strong>{tour.price}</strong> / person
          </span>
          <a href="/tour" aria-label={`Explore ${tour.title}`}>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

function DestinationContent() {
  return (
    <div className="destination-page">
      <SiteHeader />
      <main>
        <section className="destination-hero page-inset">
          <div className="destination-hero-media">
            <img
              src={images.hero}
              alt="Historic hillside houses overlooking Berat"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="destination-hero-overlay" />
            <nav className="destination-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/#destinations">Destinations</a>
              <span>/</span>
              <strong>Berat</strong>
            </nav>
            <div className="destination-hero-copy">
              <span className="destination-kicker">UNESCO World Heritage · Southern Albania</span>
              <h1>Berat</h1>
              <p>A city of a thousand windows, lived in one unhurried moment at a time.</p>
            </div>
            <a href="#packages" className="destination-hero-cta">
              Explore Berat tours <ArrowRight size={18} />
            </a>
          </div>
          <div className="destination-facts-strip" aria-label="Berat at a glance">
            <div>
              <MapPin size={19} />
              <span>
                <small>Region</small>
                <strong>Central Albania</strong>
              </span>
            </div>
            <div>
              <CalendarDays size={19} />
              <span>
                <small>Best time</small>
                <strong>April–October</strong>
              </span>
            </div>
            <div>
              <Clock3 size={19} />
              <span>
                <small>Ideal stay</small>
                <strong>2–3 days</strong>
              </span>
            </div>
            <div>
              <Navigation size={19} />
              <span>
                <small>From Tirana</small>
                <strong>2 hours</strong>
              </span>
            </div>
          </div>
        </section>

        <nav className="destination-section-nav page-inset" aria-label="Destination sections">
          <a href="#overview">Overview</a>
          <a href="#highlights">Highlights</a>
          <a href="#areas">Where to stay</a>
          <a href="#packages">Tours</a>
          <a href="#planning">Plan your visit</a>
        </nav>

        <section id="overview" className="destination-intro destination-container">
          <SectionHeading
            eyebrow="Meet Berat"
            title="History on the hillside. Life along the river."
          />
          <div className="destination-intro-grid">
            <p className="destination-lead">
              Berat is the kind of place that reveals itself slowly: in the evening light on
              Mangalem's windows, a conversation over mountain tea, and the footsteps of families
              who still call the castle home.
            </p>
            <div>
              <p>
                The Osum River divides two historic quarters and ties together centuries of Roman,
                Byzantine and Ottoman history. Yet Berat never feels like a museum. Cafes spill onto
                the promenade, vines shade stone courtyards and the city settles into a gentle
                rhythm after sunset.
              </p>
              <p>
                Come for the architecture, stay for the hospitality, and leave time for the farms,
                vineyards and dramatic landscapes just beyond the old town.
              </p>
            </div>
          </div>
        </section>

        <section id="highlights" className="destination-highlights">
          <div className="destination-container">
            <SectionHeading
              eyebrow="Why you'll love it"
              title="The essential Berat experiences"
              text="Four sides of the city, brought together by people who know every lane."
            />
            <div className="destination-highlight-grid">
              {highlights.map(({ icon: Icon, title, text }) => (
                <article key={title}>
                  <span>
                    <Icon size={21} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="destination-story destination-container">
          <div className="destination-story-grid">
            <div className="destination-story-primary">
              <img
                src={images.castle}
                alt="Stone lanes and historic architecture in Berat"
                loading="lazy"
              />
            </div>
            <div className="destination-story-copy">
              <span className="destination-eyebrow">A living landmark</span>
              <h2>Inside the walls, Berat is still home.</h2>
              <p>
                Kalaja is one of the rare fortified quarters in the Balkans where daily life never
                left. Gardens grow behind old stone walls and neighbours pause to talk beneath
                centuries-old churches.
              </p>
              <div className="destination-quote">
                <Sparkles size={20} />
                <blockquote>
                  “Go early for the quiet paths. Stay late for the golden view across the valley.”
                </blockquote>
                <span>— Elira, local host</span>
              </div>
            </div>
            <div className="destination-story-secondary">
              <img
                src={images.river}
                alt="River and mountain landscape near Berat"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section id="areas" className="destination-areas">
          <div className="destination-container">
            <SectionHeading
              eyebrow="Find your corner"
              title="Where to stay in Berat"
              text="Three neighbourhoods, each with a distinct view of the city."
            />
            <div className="destination-area-list">
              {areas.map((area) => (
                <article key={area.name}>
                  <div className="destination-area-image">
                    <img src={area.image} alt="" loading="lazy" decoding="async" />
                    <span>{area.number}</span>
                  </div>
                  <div className="destination-area-copy">
                    <span>{area.label}</span>
                    <h3>{area.name}</h3>
                    <p>{area.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className="destination-packages destination-container">
          <div className="destination-packages-heading">
            <SectionHeading
              eyebrow="Handpicked journeys"
              title="Ways to experience Berat"
              text="Flexible tours designed with trusted local guides, thoughtful pacing and plenty of room for discovery."
            />
            <a href="/tour">
              View all tours <ArrowRight size={17} />
            </a>
          </div>
          <div className="destination-package-grid">
            {packages.map((tour) => (
              <PackageCard tour={tour} key={tour.title} />
            ))}
          </div>
        </section>

        <section id="planning" className="destination-planning">
          <div className="destination-container">
            <div className="destination-planning-copy">
              <SectionHeading eyebrow="Plan your visit" title="Berat through the seasons" />
              <p>
                Spring and autumn bring warm walking weather and quieter lanes. Summer is lively and
                sun-filled; plan castle walks early and keep afternoons for long lunches or the
                river. Winter is calm, atmospheric and made for slow cultural weekends.
              </p>
              <div className="destination-planning-notes">
                <span>
                  <Sun size={19} /> 28°C average summer high
                </span>
                <span>
                  <Users size={19} /> Quieter in April, May & October
                </span>
              </div>
            </div>
            <div className="destination-season-grid">
              {[
                ["Mar–May", "Fresh hillsides", "Mild days for walking and bright countryside."],
                [
                  "Jun–Aug",
                  "Long golden evenings",
                  "Lively streets, warm nights and vineyard visits.",
                ],
                [
                  "Sep–Nov",
                  "Harvest season",
                  "Soft light, local produce and comfortable temperatures.",
                ],
                [
                  "Dec–Feb",
                  "Quiet cultural stays",
                  "Peaceful landmarks and cosy traditional dining.",
                ],
              ].map(([months, title, text], index) => (
                <article className={index === 2 ? "is-recommended" : ""} key={months}>
                  {index === 2 && <span>Our pick</span>}
                  <small>{months}</small>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="destination-faq destination-container">
          <SectionHeading eyebrow="Good to know" title="Planning questions, answered" />
          <div className="destination-faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>
                  <span>{faq.question}</span>
                  <ChevronDown size={20} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="destination-contact page-inset">
          <div>
            <span className="destination-eyebrow">Made for you</span>
            <h2>Not sure which Berat experience fits?</h2>
            <p>Tell our Albania team how you like to travel and we'll shape the right route.</p>
          </div>
          <a href="#contact">
            Talk with a local expert <ArrowRight size={18} />
          </a>
          <Compass className="destination-contact-mark" aria-hidden="true" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function DestinationDetailPage() {
  return (
    <SiteLocaleProvider locale="en" alternatePaths={{ en: "/destination/berat", fr: "/fr/" }}>
      <DestinationContent />
    </SiteLocaleProvider>
  );
}
