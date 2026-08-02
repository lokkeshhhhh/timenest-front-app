/**
 * Deterministic placeholder avatar for organizations/users without a real logo/photo.
 * Uses ui-avatars.com (initials-on-color, generated on the fly from a seed string) —
 * no download/storage needed, safe to use directly as an <Image> source.
 */
export function getPlaceholderAvatarUrl(seed: string, size: number = 128): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=random&color=fff&size=${size}&rounded=true&bold=true`;
}

export function resolveAvatarUrl(seed: string, existingUrl?: string | null, size: number = 128): string {
  return existingUrl || getPlaceholderAvatarUrl(seed, size);
}
