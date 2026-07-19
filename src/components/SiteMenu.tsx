import { ChevronDown } from "lucide-react";
import { useEffect, useId, useState } from "react";

type MenuGroup = {
  label: string;
  href?: string;
  items?: { label: string; href: string }[];
};

const menuGroups: MenuGroup[] = [
  { label: "Home", href: "/" },
  {
    label: "Explore Albania",
    items: [
      { label: "Interactive Map", href: "#interactive-map" },
      { label: "Regions", href: "#regions" },
      { label: "Hidden Gems", href: "#hidden-gems" },
      { label: "Beaches", href: "#beaches" },
      { label: "Mountains", href: "#mountains" },
      { label: "UNESCO Sites", href: "#unesco-sites" },
    ],
  },
  {
    label: "Experiences",
    items: [
      { label: "Day Tours", href: "/tour" },
      { label: "Multi-Day Tours", href: "#multi-day-tours" },
      { label: "Private Tours", href: "#private-tours" },
      { label: "Food & Wine", href: "#food-wine" },
      { label: "Adventure", href: "#adventure" },
      { label: "Hiking", href: "#hiking" },
      { label: "Cultural Experiences", href: "#cultural-experiences" },
    ],
  },
  {
    label: "Plan Your Trip",
    items: [
      { label: "Build Your Itinerary", href: "#build-your-itinerary" },
      { label: "Car Rentals", href: "#car-rentals" },
      { label: "Hotels", href: "#hotels" },
      { label: "Airport Transfers", href: "#airport-transfers" },
      { label: "Travel Guide", href: "#travel-guide" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
  {
    label: "Inspiration",
    items: [
      { label: "Travel Stories", href: "#travel-stories" },
      { label: "Photography", href: "#photography" },
      { label: "Events", href: "#events" },
      { label: "Seasonal Guides", href: "#seasonal-guides" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Reviews", href: "#reviews" },
      { label: "Gallery", href: "#gallery" },
      { label: "Share Your Trip", href: "#share-your-trip" },
    ],
  },
  {
    label: "Wonder AI",
    items: [
      { label: "Find Your Way", href: "#find-your-way" },
      { label: "Ask About Albania", href: "#ask-about-albania" },
      { label: "Personalized Recommendations", href: "#recommendations" },
    ],
  },
  { label: "Offers", href: "#offers" },
  { label: "Destinations", href: "#destinations" },
  {
    label: "About",
    items: [
      { label: "Our Story", href: "#our-story" },
      { label: "Sustainability", href: "#sustainability" },
      { label: "Partners", href: "#partners" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

export function SiteMenu() {
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        className={`icon-chip site-menu-toggle${isOpen ? " is-open" : ""}`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-controls={menuId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="menu-toggle-lines" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <div className={`site-menu-layer${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen}>
        <button
          className="site-menu-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
        />
        <aside
          id={menuId}
          className="site-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          inert={!isOpen}
        >
          <div className="site-menu-heading">Menu</div>
          <nav className="site-menu-nav" aria-label="Main navigation">
            {menuGroups.map((group) => {
              const hasItems = Boolean(group.items?.length);
              const isExpanded = expandedItem === group.label;
              const submenuId = `${menuId}-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

              return (
                <div
                  className={`site-menu-group${isExpanded ? " is-expanded" : ""}`}
                  key={group.label}
                >
                  {hasItems ? (
                    <button
                      type="button"
                      className="site-menu-primary"
                      aria-controls={submenuId}
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedItem(isExpanded ? null : group.label)}
                    >
                      <span>{group.label}</span>
                      <ChevronDown size={18} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                  ) : (
                    <a className="site-menu-primary" href={group.href} onClick={closeMenu}>
                      <span>{group.label}</span>
                    </a>
                  )}

                  {hasItems && (
                    <div id={submenuId} className="site-menu-submenu" aria-hidden={!isExpanded}>
                      <div>
                        {group.items?.map((item) => (
                          <a href={item.href} key={item.label} onClick={closeMenu}>
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <a className="site-menu-cta" href="#plan-your-trip" onClick={closeMenu}>
            <span>Plan Your Trip</span>
            <span aria-hidden="true">→</span>
          </a>
        </aside>
      </div>
    </>
  );
}
