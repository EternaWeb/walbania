export const SITE_NAME = "Wonder Albania";
export const LEGACY_SITE_NAME = "WonderAlbania";
export const SITE_URL = "https://wonderalbania.com";
export const SITE_DESCRIPTION =
  "Curated Albania holidays, private journeys and local experiences designed by experts who call Albania home.";

/**
 * Keeps every route title branded, including SEO titles supplied by the CMS.
 * Legacy titles are normalized instead of receiving a duplicate suffix.
 */
export function brandedTitle(title: string) {
  const normalized = title.trim().replaceAll(LEGACY_SITE_NAME, SITE_NAME);
  if (!normalized) return SITE_NAME;
  if (normalized.toLocaleLowerCase().includes(SITE_NAME.toLocaleLowerCase())) return normalized;
  return `${normalized} | ${SITE_NAME}`;
}
