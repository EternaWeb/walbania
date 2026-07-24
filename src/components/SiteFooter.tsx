import { Facebook, Instagram, Linkedin, Music2, Youtube } from "lucide-react";
import { useLocalize, useSiteLocale } from "../i18n";

const socialLinks = [
  {
    label: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/wonder.albania/",
  },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/company/wonderalbania",
  },
  { label: "TikTok", icon: Music2, href: "#" },
];

export function SiteFooter() {
  const locale = useSiteLocale();
  const localize = useLocalize();

  return localize(
    <footer id="contact" className="site-footer bg-white border-t">
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
                <a href="tel:+355692290036" className="hover:text-[#1F2528]">
                  +355 692290036
                </a>
              </p>
              <p>
                <a href="tel:0682778037" className="hover:text-[#1F2528]">
                  0682778037
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
                {(links as string[]).map((label) => {
                  const href =
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
                            : label === "Terms of Service"
                              ? "/terms-of-service"
                              : "#";

                  return (
                    <li key={label}>
                      <a href={href} className="hover:text-[#1F2528]">
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
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
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="icon-chip"
                  style={{ width: 34, height: 34 }}
                  {...(href !== "#" ? { target: "_blank", rel: "noreferrer" } : {})}
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
