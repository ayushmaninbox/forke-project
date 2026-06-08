import { cookies } from 'next/headers'

// Single source of truth for marketing attribution.
// First-party signals only (UTM params, referrer, landing page) — no IP / device fingerprint.

export const ATTRIBUTION_COOKIE = 'forke_attribution'

export type Attribution = {
  source: string
  medium?: string
  campaign?: string
  referrer?: string
  landingPage?: string
  firstSeenAt?: string
  signupRole?: 'developer' | 'owner'
}

/**
 * Normalize a raw ?source= / ?utm_source= value into a clean, comparable channel slug.
 * Used by the middleware (capture), the waitlist route, and server actions so they all agree.
 */
export function normalizeSource(raw?: string | null): string {
  if (!raw) return 'direct'
  const cleaned = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '') // strip anything that isn't a safe slug char
    .slice(0, 32)
  return cleaned || 'direct'
}

/** Light cleaner for free-text attribution fields (medium/campaign). Keeps it short and printable. */
function cleanField(raw?: string | null): string | undefined {
  if (!raw) return undefined
  const cleaned = raw.toLowerCase().trim().replace(/[^a-z0-9_\- ]/g, '').slice(0, 64)
  return cleaned || undefined
}

/**
 * Read the first-touch attribution cookie set by middleware.
 * Server-side only. Returns a safe { source: 'direct' } fallback when missing or malformed.
 */
export async function readAttributionCookie(): Promise<Attribution> {
  try {
    const store = await cookies()
    const raw = store.get(ATTRIBUTION_COOKIE)?.value
    if (!raw) return { source: 'direct' }
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<Attribution>
    return {
      source: normalizeSource(parsed.source),
      medium: cleanField(parsed.medium),
      campaign: cleanField(parsed.campaign),
      referrer: typeof parsed.referrer === 'string' ? parsed.referrer.slice(0, 255) : undefined,
      landingPage: typeof parsed.landingPage === 'string' ? parsed.landingPage.slice(0, 255) : undefined,
      firstSeenAt: typeof parsed.firstSeenAt === 'string' ? parsed.firstSeenAt : undefined,
    }
  } catch {
    return { source: 'direct' }
  }
}
