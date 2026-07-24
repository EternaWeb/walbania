import { useEffect, useState } from "react";
import { useLocalize, useSiteLocale } from "../i18n";

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

export function TravelerReviewsSection({ className = "" }: { className?: string }) {
  const locale = useSiteLocale();
  const localize = useLocalize();
  const [storyIndex, setStoryIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const story = travelerStories[storyIndex];

  useEffect(() => {
    let changeTimer: ReturnType<typeof setTimeout> | undefined;
    let openingTimer: ReturnType<typeof setTimeout> | undefined;
    const interval = window.setInterval(() => {
      setIsChanging(true);
      changeTimer = window.setTimeout(() => {
        setStoryIndex((current) => (current + 1) % travelerStories.length);
        setIsChanging(false);
        setIsOpening(true);
        openingTimer = window.setTimeout(() => setIsOpening(false), 60);
      }, 380);
    }, 4000);

    return () => {
      window.clearInterval(interval);
      if (changeTimer) window.clearTimeout(changeTimer);
      if (openingTimer) window.clearTimeout(openingTimer);
    };
  }, []);

  return localize(
    <section className={`page-inset pb-14 md:pb-20 ${className}`.trim()} id="reviews">
      <div className="traveler-reviews-panel">
        <h2>{locale === "fr" ? "Nos voyageurs nous adorent" : "Travelers Love Us"}</h2>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className={`tly-stack${isExpanded ? " is-expanded" : ""}${
              isChanging ? " is-changing" : ""
            }${isOpening ? " is-opening" : ""}`}
            aria-label={isExpanded ? "Close traveler photos" : "Open traveler photos"}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {story.photos.map((src, index) => (
              <span key={`${storyIndex}-${src}`} className={`tly-card tly-card-${index}`}>
                <img
                  src={src}
                  alt={`Traveler moment ${index + 1} from ${story.author}`}
                  loading="lazy"
                />
              </span>
            ))}
          </button>
        </div>

        <p
          className={`tly-review traveler-reviews-quote${
            isChanging ? " is-changing" : ""
          }${isOpening ? " is-opening" : ""}`}
          aria-live="polite"
        >
          “{story.quote}” <span>— {story.author}</span>
        </p>
        <a
          className="btn-brand traveler-reviews-button"
          href="https://share.google/OUJlx4oikDh8jftuK"
          target="_blank"
          rel="noreferrer"
        >
          Read Reviews
        </a>
      </div>
    </section>,
  );
}
