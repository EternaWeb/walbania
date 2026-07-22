export const PLACE_HERO_COLORS = ["#264653", "#283618", "#1F2528", "#3A5A40"] as const;

/**
 * Selects a palette color with a deterministic FNV-1a hash. It feels varied
 * across places, but the same database ID always receives the same color.
 */
export function stablePlaceHeroColor(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return PLACE_HERO_COLORS[(hash >>> 0) % PLACE_HERO_COLORS.length];
}
