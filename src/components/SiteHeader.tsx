import { Search, Sparkle } from "lucide-react";
import { LocaleLocationModal } from "./LocaleLocationModal";
import { SiteMenu } from "./SiteMenu";
import { useLocalize, useSiteLocale } from "../i18n";

export type SiteBreadcrumb = { href?: string; label: string };

export function SiteHeader({ breadcrumbs }: { breadcrumbs?: SiteBreadcrumb[] }) {
  const locale = useSiteLocale();
  const localize = useLocalize();
  const homePath = locale === "fr" ? "/fr/" : "/";

  return localize(
    <>
      <div className="site-contact-bar">
        <div className="page-inset site-navigation py-2 text-xs">
          <a href="#contact" className="talk-with-us-link underline underline-offset-2">
            Talk with Us
          </a>
        </div>
      </div>
      <header className="site-header page-inset site-navigation py-4">
        <div className="flex items-center justify-between gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm flex-1" aria-label="Primary">
            {breadcrumbs?.length ? (
              <ol className="site-header-breadcrumb" aria-label="Breadcrumb">
                {breadcrumbs.map((item, index) => (
                  <li key={`${item.label}-${index}`}>
                    {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
                  </li>
                ))}
              </ol>
            ) : (
              <>
                <a
                  href={locale === "fr" ? "/fr/#about" : "/about"}
                  className="hover:text-[#1F2528]"
                >
                  About
                </a>
                <a href={locale === "fr" ? "/fr/tour" : "/tour"} className="hover:text-[#1F2528]">
                  Tours
                </a>
                <a
                  href={locale === "fr" ? "/fr/destinations" : "/destinations"}
                  className="hover:text-[#1F2528]"
                >
                  Destinations
                </a>
              </>
            )}
          </nav>
          <div className="flex-1 md:flex md:justify-center">
            <a href={homePath} aria-label="Wonder Albania home">
              <img src="/weblogo.png" alt="Wonder Albania" className="h-6 md:h-7 w-auto" />
            </a>
          </div>
          <div className="flex items-center gap-[10px] flex-1 justify-end">
            <LocaleLocationModal />
            <button type="button" aria-label="Search" className="icon-chip">
              <Search size={18} />
            </button>
            <button type="button" aria-label="AI" className="icon-chip">
              <Sparkle size={19} fill="black" strokeWidth={1.7} />
            </button>
            <SiteMenu />
          </div>
        </div>
      </header>
    </>,
  );
}
