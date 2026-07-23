import {
  Award,
  BadgeCheck,
  Facebook,
  Globe,
  Instagram,
  Leaf,
  Linkedin,
  Music2,
  ShieldCheck,
  Youtube,
} from "lucide-react";
import { useLocalize, useSiteLocale } from "../i18n";

export function SiteFooter() {
  const locale = useSiteLocale();
  const localize = useLocalize();

  return localize(
    <footer id="contact" className="site-footer bg-white border-t">
      <div className="page-inset py-12 border-b">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">
              Join the Wonder Albania newsletter
            </h3>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Fresh itineraries, insider tips, and members-only deals — once a month.
            </p>
          </div>
          <form className="flex gap-2 w-full" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              aria-label="Email address"
              placeholder="your@email.com"
              className="flex-1 min-w-0 px-4 py-3 rounded-[2px] border text-sm outline-none focus:border-[#1F2528]"
            />
            <button type="submit" className="btn-brand bg-[#1F2528] text-white">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="page-inset py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 text-sm">
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
                <a href="tel:+355691234567" className="hover:text-[#1F2528]">
                  +355 69 123 45 67
                </a>
              </p>
            </div>
          </div>

          {[
            ["Explore", ["Tours", "Destinations", "Attractions", "Offers", "Experiences"]],
            ["Company", ["About Us", "Our Team", "Careers", "Press", "Contact"]],
            [
              "Support",
              [
                "Help Center",
                "Travel Insurance",
                "Booking Terms",
                "Cancellations",
                "Sustainability",
              ],
            ],
            [
              "Legal",
              ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Modern Slavery"],
            ],
          ].map(([heading, links]) => (
            <div key={heading as string}>
              <h4 className="font-semibold mb-4">{heading}</h4>
              <ul className="space-y-2 text-muted-foreground">
                {(links as string[]).map((label) => (
                  <li key={label}>
                    <a
                      href={
                        label === "Tours"
                          ? locale === "fr"
                            ? "/fr/tour"
                            : "/tour"
                          : label === "Destinations"
                            ? locale === "fr"
                              ? "/fr/destinations"
                              : "/destinations"
                            : label === "Attractions"
                              ? locale === "fr"
                                ? "/fr/attractions"
                                : "/attractions"
                              : label === "About Us"
                                ? locale === "fr"
                                  ? "/fr/#about"
                                  : "/about"
                                : "#"
                      }
                      className="hover:text-[#1F2528]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-10 border-t">
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
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-[2px] border text-xs text-muted-foreground"
              >
                <Icon size={14} className="text-[#1F2528]" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="page-inset py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Wonder Albania sh.p.k. — Registered No. K12345678L. All
              rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: "Instagram", icon: Instagram },
                { label: "Facebook", icon: Facebook },
                { label: "YouTube", icon: Youtube },
                { label: "LinkedIn", icon: Linkedin },
                { label: "TikTok", icon: Music2 },
              ].map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="icon-chip"
                  style={{ width: 34, height: 34 }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>,
  );
}
