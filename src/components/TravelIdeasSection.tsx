import { useLocalize } from "../i18n";

const ideaImages = [
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

export function TravelIdeasSection({ className = "" }: { className?: string }) {
  const localize = useLocalize();

  return localize(
    <section
      className={`page-inset pb-14 ${className}`.trim()}
      aria-labelledby="travel-ideas-title"
    >
      <div className="travel-ideas-panel">
        <p>Get wonderful ideas</p>
        <h2 id="travel-ideas-title">Not sure where to go?</h2>

        <div className="mt-10 relative marquee-mask">
          <div className="marquee">
            <div className="marquee-track">
              {[...ideaImages, ...ideaImages].map((src, index) => (
                <a
                  href="/tour"
                  className="marquee-item card-zoom overflow-hidden bg-white/20"
                  aria-label="Explore trip ideas"
                  key={`${src}-${index}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="card-zoom-img w-full h-full object-cover"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <a className="btn-brand travel-ideas-button" href="/tour">
          Get Ideas
        </a>
      </div>
    </section>,
  );
}
