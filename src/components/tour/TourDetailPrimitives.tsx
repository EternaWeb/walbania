import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { PerformanceImage } from "../PerformanceImage";

export type DetailHeroFact = {
  label: string;
  value: string;
};

export function DetailHero({
  image,
  imageAlt,
  badge,
  photoLink,
  info,
  title,
  titleId,
  intro,
  primaryAction,
  secondaryAction,
  facts,
  mobileBreadcrumb,
}: {
  image: string;
  imageAlt: string;
  badge?: string;
  photoLink?: { href: string; label: string };
  info: ReactNode;
  title: ReactNode;
  titleId?: string;
  intro: string;
  primaryAction: { href: string; label: string };
  secondaryAction?: ReactNode;
  facts: DetailHeroFact[];
  mobileBreadcrumb?: Array<{ href?: string; label: string }>;
}) {
  return (
    <section className="tour-container hero-section">
      <div className="hero-shell">
        <div className="hero-grid">
          <div className="hero-visual">
            <PerformanceImage
              src={image}
              alt={imageAlt}
              width={1600}
              height={1067}
              sizes="(max-width: 767px) calc(100vw - 24px), (max-width: 1100px) 55vw, 700px"
              maxWidth={1600}
              priority
            />
            <div className="hero-ribbons">
              {badge && <div className="hero-badge hero-badge-mobile">{badge}</div>}
              {photoLink && (
                <a className="photo-count" href={photoLink.href}>
                  {photoLink.label}
                </a>
              )}
            </div>
            {mobileBreadcrumb?.length ? (
              <ol className="hero-mobile-breadcrumb" aria-label="Breadcrumb">
                {mobileBreadcrumb.map((item, index) => (
                  <li key={`${item.label}-${index}`}>
                    {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
          <div className="hero-copy">
            {badge && <div className="hero-badge hero-badge-desktop">{badge}</div>}
            <div className="hero-copy-content">
              <div className="hero-info-row">{info}</div>
              <h1 id={titleId}>{title}</h1>
              <p className="hero-intro">{intro}</p>
              <div className="hero-actions">
                <a className="primary-button hero-book" href={primaryAction.href}>
                  {primaryAction.label}
                </a>
                {secondaryAction}
              </div>
            </div>
          </div>
        </div>
        <div className="hero-facts-strip">
          {facts.map((fact) => (
            <div className="hero-fact" key={fact.label}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
          <div className="hero-facts-action">
            <a className="primary-button hero-book" href={primaryAction.href}>
              {primaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DetailSectionNav({
  label,
  links,
}: {
  label: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <nav className="section-nav" aria-label={label}>
      {links.map((link) => (
        <a href={link.href} key={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export type DetailFact = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function DetailFacts({ label, facts }: { label: string; facts: DetailFact[] }) {
  return (
    <section className="facts-panel" aria-label={label}>
      {facts.map(({ icon: Icon, label: factLabel, value }) => (
        <div className="fact" key={factLabel}>
          <Icon size={20} />
          <div>
            <span>{factLabel}</span>
            <strong>{value}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}

export type DetailHighlight = {
  icon: LucideIcon;
  label: string;
  text: string;
};

export function DetailHighlights({ highlights }: { highlights: DetailHighlight[] }) {
  return (
    <div className="highlight-shell">
      <div className="highlight-track">
        {highlights.map(({ icon: Icon, label, text }, index) => (
          <article className="highlight-card" key={`${label}-${index}`}>
            <div className="highlight-icon">
              <Icon size={20} />
            </div>
            <h3>{label}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  titleId,
  level = 2,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: string;
  titleId?: string;
  level?: 2 | 3;
}) {
  const Heading = level === 3 ? "h3" : "h2";
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading id={titleId}>{title}</Heading>
      {text && <p>{text}</p>}
    </div>
  );
}
