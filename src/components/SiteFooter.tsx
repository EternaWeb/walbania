import { useLocalize, useSiteLocale } from "../i18n";

const socialLinks = [
  {
    label: "Instagram",
    icon: "/social/instagram.svg",
    href: "https://www.instagram.com/wonder.albania/",
  },
  {
    label: "LinkedIn",
    icon: "/social/linkedin.svg",
    href: "https://www.linkedin.com/company/wonderalbania",
  },
  {
    label: "Google",
    icon: "/social/google.svg",
    href: "https://share.google/OUJlx4oikDh8jftuK",
  },
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
                <a href="tel:+355682778037" className="hover:text-[#1F2528]">
                  +355 682778037
                </a>
              </p>
            </div>
          </div>

          {[
            ["Explore", ["Tours", "Destinations", "Attractions", "Offers", "Experiences"]],
            ["Company", ["About Us", "Our Team", "Careers", "Press", "Contact"]],
            ["Support", ["Help Center", "Travel Insurance", "Sustainability", "Contact"]],
            [
              "Legal",
              [
                "Booking Terms and Conditions",
                "Cancellation Terms and Conditions",
                "Privacy and Cookie Policy",
              ],
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
                            : label === "Booking Terms and Conditions"
                              ? "/booking-terms"
                              : label === "Cancellation Terms and Conditions"
                                ? "/cancelation"
                                : label === "Privacy and Cookie Policy"
                                  ? "/privacy-policy"
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
            <p>© 2026 Wonder Albania. All rights reserved.</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="icon-chip"
                  style={{ width: 34, height: 34 }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={icon} alt="" width={16} height={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>,
  );
}
