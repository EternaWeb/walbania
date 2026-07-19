import { createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  BadgeCheck,
  CalendarDays,
  Camera,
  Car,
  Check,
  ChevronDown,
  Clock3,
  Facebook,
  Globe2,
  Heart,
  Instagram,
  Languages,
  Linkedin,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Mountain,
  Navigation,
  Phone,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  ThermometerSun,
  Ticket,
  Users,
  Utensils,
  Waves,
  Youtube,
} from "lucide-react";

export const Route = createFileRoute("/tour")({
  component: TourPage,
});

const images = {
  hero: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1800&q=80",
  coast: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
  town: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85",
  mountains: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
  boat: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85",
  sunset: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85",
};

const quickFacts = [
  { icon: Clock3, label: "Duration", value: "8 hours" },
  { icon: Mountain, label: "Difficulty", value: "Easy" },
  { icon: Users, label: "Group size", value: "Up to 8" },
  { icon: Car, label: "Tour type", value: "Private" },
  { icon: Languages, label: "Languages", value: "EN · FR · SQ" },
  { icon: MapPin, label: "Starts in", value: "Sarandë" },
  { icon: Navigation, label: "Ends in", value: "Sarandë" },
  { icon: Accessibility, label: "Accessibility", value: "Ask our team" },
];

const highlights = [
  { icon: Waves, label: "Hidden beaches", text: "Swim in quiet coves with clear Ionian water." },
  { icon: Utensils, label: "Local table", text: "Share a seasonal lunch at a family-run taverna." },
  { icon: Camera, label: "Coastal villages", text: "Wander the stone lanes of Qeparo and Himarë." },
  { icon: Sun, label: "Golden hour", text: "Finish with the Riviera glowing below Llogara." },
];

const itinerary = [
  { time: "08:30", place: "Sarandë", duration: "30 min", text: "Meet your local guide at your hotel and settle into a private, air-conditioned vehicle.", tag: "Pickup" },
  { time: "09:30", place: "Porto Palermo", duration: "1 hr 15 min", text: "Explore the triangular fortress and hear the stories behind one of Albania’s most dramatic bays.", tag: "History" },
  { time: "11:15", place: "Himarë", duration: "2 hr", text: "Swim, stroll the seafront and enjoy an unhurried lunch made with produce from the coast.", tag: "Swim & lunch" },
  { time: "14:15", place: "Qeparo village", duration: "1 hr 15 min", text: "Climb into the old village for slate roofs, mountain air and wide views across the Ionian Sea.", tag: "Village walk" },
  { time: "16:30", place: "Borsh viewpoint", duration: "45 min", text: "Pause for coffee and a final panorama before the relaxed drive back to Sarandë.", tag: "Viewpoint" },
];

const included = ["Private return transport", "Licensed local guide", "Seasonal Albanian lunch", "Fortress entrance ticket", "Hotel pickup in Sarandë", "Bottled water"];
const excluded = ["Personal purchases", "Additional drinks", "Guide gratuities", "Optional beach equipment"];
const packing = ["Comfortable shoes", "Swimwear & towel", "Passport or ID", "Refillable water bottle", "Sunscreen", "Light jacket"];

const faqs = [
  ["Can children join this tour?", "Yes. The relaxed pace works well for families, and child seats can be requested in advance."],
  ["Is October a good month to visit?", "October is usually quieter and mild. Sea conditions vary, so swimming is always weather-dependent."],
  ["How much walking is involved?", "Around 3 km in total, mostly easy, with some uneven stone lanes in Qeparo and at Porto Palermo."],
  ["Can dietary requirements be accommodated?", "Vegetarian and common dietary needs can usually be arranged when shared before the tour."],
];

const relatedTours = [
  { title: "Blue Eye & Gjirokastër", meta: "Full day · Culture", price: "Sample from €—", image: images.town },
  { title: "Llogara Sunset Escape", meta: "5 hours · Nature", price: "Sample from €—", image: images.mountains },
  { title: "Ksamil by Private Boat", meta: "4 hours · Sea", price: "Sample from €—", image: images.boat },
];

function Header() {
  return (
    <>
      <div style={{ background: "#434DFF" }} className="w-full">
        <div className="page-inset py-2 text-xs">
          <a href="#support" className="text-white underline underline-offset-2">Talk with Us</a>
        </div>
      </div>
      <header className="page-inset py-4">
        <div className="flex items-center justify-between gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm flex-1" aria-label="Primary navigation">
            <a href="#overview">About</a>
            <a href="#related">Offers</a>
            <a href="#map">Destinations</a>
          </nav>
          <a className="flex-1 md:flex md:justify-center" href="/" aria-label="WonderAlbania home">
            <img src="/weblogo.png" alt="WonderAlbania" className="h-6 md:h-7 w-auto" />
          </a>
          <div className="flex items-center gap-[10px] flex-1 justify-end">
            <button type="button" className="icon-chip" aria-label="Language"><Globe2 size={18} /></button>
            <button type="button" className="icon-chip" aria-label="Search"><Search size={18} /></button>
            <button type="button" className="icon-chip" aria-label="AI"><Sparkles size={18} fill="black" /></button>
            <button type="button" className="icon-chip" aria-label="Menu"><Menu size={18} strokeWidth={2.5} /></button>
          </div>
        </div>
      </header>
    </>
  );
}

function BookingCard({ mobile = false }: { mobile?: boolean }) {
  return (
    <aside className={mobile ? "booking-card booking-card-mobile" : "booking-card"} aria-label="Booking preview">
      <div className="booking-eyebrow"><BadgeCheck size={15} /> Instant confirmation</div>
      <div className="price-line">
        <div>
          <span className="price-note">Sample price from</span>
          <strong>€129</strong>
          <span className="per-person"> / person</span>
        </div>
        <span className="discount-chip">Save 15%</span>
      </div>
      <div className="booking-field"><span><CalendarDays size={18} /> Select a date</span><ChevronDown size={18} /></div>
      <div className="booking-field">
        <span><Users size={18} /> 2 travellers</span>
        <div className="stepper-preview" aria-hidden="true"><Minus size={14} /><b>2</b><span>+</span></div>
      </div>
      <button type="button" className="primary-button">Check availability</button>
      <p className="booking-small">You won’t be charged. This page is a visual preview.</p>
      <div className="booking-trust">
        <span><ShieldCheck size={17} /> Free cancellation preview</span>
        <span><Phone size={17} /> Local support</span>
      </div>
    </aside>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow?: string; title: React.ReactNode; text?: string }) {
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function TourPage() {
  return (
    <div className="tour-page">
      <Header />
      <main>
        <section className="tour-container hero-section">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><a href="#related">Tours</a><span>/</span><b>Albanian Riviera</b>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="location-label"><MapPin size={16} /> Albanian Riviera · Southern Albania</div>
              <h1>Riviera secrets:<br /><em>villages, bays & blue water</em></h1>
              <p className="hero-intro">A private day along Albania’s wild southern coast, pairing hidden beaches, stone villages and lunch with a local family.</p>
              <div className="hero-meta">
                <span className="rating"><Star size={17} fill="currentColor" /> 4.9</span>
                <a href="#reviews">128 traveller reviews</a>
                <span className="meta-divider" />
                <span><Clock3 size={17} /> 8 hours</span>
              </div>
              <div className="hero-actions">
                <a className="primary-button hero-book" href="#booking">See dates</a>
                <button type="button" className="secondary-button"><Heart size={18} /> Save</button>
                <button type="button" className="square-button" aria-label="Share tour"><Share2 size={18} /></button>
              </div>
            </div>
            <div className="hero-visual">
              <img src={images.hero} alt="Rocky coastline and clear blue water on the Albanian Riviera" />
              <div className="hero-badge"><Sparkles size={15} /> Local favourite</div>
              <button type="button" className="photo-count"><Camera size={16} /> 18 photos</button>
            </div>
          </div>
        </section>

        <div className="tour-container content-shell">
          <div className="content-main">
            <nav className="section-nav" aria-label="Tour sections">
              <a href="#overview">Overview</a><a href="#itinerary">Itinerary</a><a href="#included">Details</a><a href="#reviews">Reviews</a>
            </nav>

            <section className="facts-panel" aria-label="Quick tour facts">
              {quickFacts.map(({ icon: Icon, label, value }) => (
                <div className="fact" key={label}><Icon size={20} /><div><span>{label}</span><strong>{value}</strong></div></div>
              ))}
            </section>

            <section id="overview" className="content-section overview-section">
              <SectionHeading eyebrow="The experience" title={<>A slower way to see the <em>Riviera</em></>} />
              <div className="overview-grid">
                <p className="lead-copy">This isn’t a checklist tour. It’s a day shaped by a local guide who knows where the road opens to the best sea views, which village café is worth the detour, and when a bay is at its quietest.</p>
                <div className="overview-copy">
                  <p>Made for curious travellers, couples and families, the route balances easy exploration with generous time to swim, eat and simply take in the coast.</p>
                  <p>Every stop has a reason to be here—from the fortress at Porto Palermo to Qeparo’s stone lanes and the family recipes served over lunch.</p>
                </div>
              </div>
            </section>

            <section className="content-section">
              <SectionHeading eyebrow="Why you’ll love it" title="Tour highlights" />
              <div className="highlight-grid">
                {highlights.map(({ icon: Icon, label, text }) => (
                  <article className="highlight-card" key={label}>
                    <div className="highlight-icon"><Icon size={20} /></div><h3>{label}</h3><p>{text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="gallery-section" aria-label="Tour gallery">
              <div className="gallery-large"><img src={images.coast} alt="Clear water along a sheltered beach" /></div>
              <div className="gallery-small"><img src={images.town} alt="Historic stone town in southern Albania" /></div>
              <div className="gallery-small gallery-overlay"><img src={images.food} alt="A shared table with fresh local food" /><span><Camera size={18} /> View gallery</span></div>
            </section>

            <section id="itinerary" className="content-section">
              <SectionHeading eyebrow="Your day" title={<>The full <em>itinerary</em></>} text="Times are a guide. Your host keeps the day flexible for weather, traffic and the best local moments." />
              <div className="itinerary">
                {itinerary.map((stop, index) => (
                  <article className="itinerary-stop" key={stop.place}>
                    <div className="timeline-marker"><span>{String(index + 1).padStart(2, "0")}</span></div>
                    <div className="itinerary-time"><strong>{stop.time}</strong><span>{stop.duration}</span></div>
                    <div className="itinerary-copy">
                      <span className="tag">{stop.tag}</span><h3>{stop.place}</h3><p>{stop.text}</p>
                      <span className="coordinate"><MapPin size={14} /> Southern Albania route</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="map" className="map-card">
              <div className="map-art" aria-label="Illustrative tour route map">
                <div className="map-coast coast-a" /><div className="map-coast coast-b" /><div className="route-line" />
                {["Sarandë", "Porto Palermo", "Himarë", "Qeparo"].map((label, index) => (
                  <div className={`map-pin map-pin-${index + 1}`} key={label}><span>{index + 1}</span><b>{label}</b></div>
                ))}
              </div>
              <div className="map-copy">
                <span className="eyebrow">The route</span><h2>Coastline, connected.</h2>
                <p>An illustrative route from Sarandë through the Riviera’s villages, beaches and historic bays.</p>
                <div className="route-stat"><Navigation size={18} /><span><b>112 km</b> return route</span></div>
                <div className="route-stat"><Clock3 size={18} /><span><b>8 hours</b> door to door</span></div>
              </div>
            </section>

            <section id="included" className="content-section details-section">
              <SectionHeading eyebrow="Good to know" title="Everything, clearly explained" />
              <div className="included-grid">
                <article className="detail-card included-card"><h3><Check size={20} /> What’s included</h3><ul>{included.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></article>
                <article className="detail-card"><h3><Minus size={20} /> Not included</h3><ul>{excluded.map((item) => <li key={item}><Minus size={16} />{item}</li>)}</ul></article>
                <article className="detail-card packing-card"><h3><Ticket size={20} /> What to bring</h3><div className="packing-list">{packing.map((item) => <span key={item}>{item}</span>)}</div></article>
              </div>
            </section>

            <section className="weather-card">
              <div><span className="eyebrow">Best time to go</span><h2>Made for long, blue days.</h2><p>May through October is the classic season, with June and September balancing warm water and quieter roads.</p></div>
              <div className="weather-stats">
                <div><ThermometerSun size={23} /><strong>24–29°C</strong><span>Typical summer high</span></div>
                <div><Waves size={23} /><strong>22–26°C</strong><span>Typical sea temperature</span></div>
                <div><Sun size={23} /><strong>May–Oct</strong><span>Recommended window</span></div>
              </div>
            </section>

            <section id="reviews" className="content-section reviews-section">
              <SectionHeading eyebrow="Traveller stories" title={<>Rated <em>4.9</em> by our guests</>} />
              <div className="review-summary">
                <div className="review-score"><strong>4.9</strong><div><div className="stars">★★★★★</div><span>128 reviews</span></div></div>
                <div className="rating-bars">
                  {[["Guide", "4.9", 98], ["Itinerary", "4.8", 94], ["Value", "4.8", 94]].map(([label, score, width]) => (
                    <div className="rating-row" key={label}><span>{label}</span><div><i style={{ width: `${width}%` }} /></div><b>{score}</b></div>
                  ))}
                </div>
              </div>
              <div className="review-grid">
                <article className="review-card">
                  <div className="review-top"><div className="avatar">AM</div><div><strong>Amelia M.</strong><span><BadgeCheck size={14} /> Verified traveller</span></div></div>
                  <div className="stars">★★★★★</div><p>“The day felt completely personal. Our guide knew exactly when to linger, and lunch overlooking the water was the moment we’ll remember.”</p><span>United Kingdom · Travelled as a couple</span>
                </article>
                <article className="review-photo"><img src={images.sunset} alt="Traveller view across the coast at sunset" /><span>Traveller photo</span></article>
              </div>
            </section>

            <section className="content-section faq-section">
              <SectionHeading eyebrow="Before you go" title="Frequently asked questions" />
              <div className="faq-list">
                {faqs.map(([question, answer], index) => (
                  <details key={question} open={index === 0}><summary><span>{question}</span><ChevronDown size={20} /></summary><p>{answer}</p></details>
                ))}
              </div>
            </section>

            <section className="safety-card">
              <div className="safety-icon"><ShieldCheck size={24} /></div>
              <div>
                <span className="eyebrow">Safety & flexibility</span><h2>Travel with calm, local support.</h2>
                <p>Your guide adapts the route to road and sea conditions. Emergency support is available during your tour, and recommended travel insurance is shown before confirmation.</p>
                <div className="safety-links"><a href="#support">Read safety information</a><a href="#support">View cancellation policy</a></div>
              </div>
            </section>

            <section className="assistant-card">
              <div className="assistant-heading"><div className="assistant-icon"><Sparkles size={22} /></div><div><span>Wonder AI</span><h2>Ask about this tour</h2></div></div>
              <p>I know the itinerary, route and practical details. Try one of these:</p>
              <div className="question-chips"><span>Can children join?</span><span>Is October a good month?</span><span>Can I swim here?</span></div>
              <div className="assistant-input"><span><MessageCircle size={18} /> Ask a question about this tour…</span><button type="button" aria-label="Send question"><Sparkles size={17} /></button></div>
            </section>
          </div>
          <div id="booking" className="booking-column"><BookingCard /></div>
        </div>

        <BookingCard mobile />

        <section id="related" className="related-section">
          <div className="tour-container">
            <SectionHeading eyebrow="Keep exploring" title={<>More ways to see <em>Albania</em></>} />
            <div className="related-grid">
              {relatedTours.map((tour) => (
                <article className="tour-card" key={tour.title}>
                  <div className="tour-image"><img src={tour.image} alt="" /><button type="button" aria-label={`Save ${tour.title}`}><Heart size={18} /></button></div>
                  <div className="tour-card-copy"><span>{tour.meta}</span><h3>{tour.title}</h3><div><b>{tour.price}</b><span><Star size={14} fill="currentColor" /> 4.9</span></div></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer id="support" className="site-footer">
      <div className="tour-container newsletter">
        <div><span className="eyebrow">A little Albania, monthly</span><h2>Travel stories worth opening.</h2></div>
        <div className="newsletter-form"><span>your@email.com</span><button type="button">Join us</button></div>
      </div>
      <div className="tour-container footer-main">
        <div className="footer-brand"><img src="/weblogo.png" alt="WonderAlbania" /><p>Thoughtful Albania journeys, shaped by people who call it home.</p><a href="mailto:hello@wonderalbania.com">hello@wonderalbania.com</a></div>
        <div className="footer-links">
          <div><b>Explore</b><a href="#related">Tours</a><a href="#map">Destinations</a><a href="#reviews">Stories</a></div>
          <div><b>Company</b><a href="#overview">About us</a><a href="#support">Contact</a><a href="#support">Local experts</a></div>
          <div><b>Support</b><a href="#included">Tour details</a><a href="#support">Booking terms</a><a href="#support">Accessibility</a></div>
        </div>
      </div>
      <div className="tour-container footer-bottom">
        <span>© 2026 WonderAlbania. Design preview.</span>
        <div><a href="#support" aria-label="Instagram"><Instagram size={17} /></a><a href="#support" aria-label="Facebook"><Facebook size={17} /></a><a href="#support" aria-label="YouTube"><Youtube size={17} /></a><a href="#support" aria-label="LinkedIn"><Linkedin size={17} /></a></div>
      </div>
    </footer>
  );
}
