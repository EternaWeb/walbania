import { Search, Sparkle } from "lucide-react";
import { LocaleLocationModal } from "./LocaleLocationModal";
import { SiteMenu } from "./SiteMenu";
import { useLocalize, useSiteLocale } from "../i18n";

export function SiteHeader() {
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
            <a href={locale === "fr" ? "/fr/#about" : "/about"} className="hover:text-[#1F2528]">
              About
            </a>
            <a href={`${homePath}#offers`} className="hover:text-[#1F2528]">
              Offers
            </a>
            <a href={`${homePath}#destinations`} className="hover:text-[#1F2528]">
              Destinations
            </a>
          </nav>
          <div className="flex-1 md:flex md:justify-center">
            <a href={homePath} aria-label="WonderAlbania home">
              <img src="/weblogo.png" alt="WonderAlbania" className="h-6 md:h-7 w-auto" />
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
