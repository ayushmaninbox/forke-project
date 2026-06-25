import { createHash } from 'node:crypto'

// Server-side analytics helpers (Node runtime only — uses node:crypto).
// Two distinct concerns live here on purpose:
//   1. Visit tracking  -> first-party marketing signal, NO IP (see lib/utils/attribution.ts).
//   2. IP hashing       -> security/auth log only, one-way salted hash, never the raw IP.

export const SESSION_COOKIE = 'forke_session'

/** Salt for IP hashing. Set ANALYTICS_IP_SALT in env; fall back keeps dev working. */
const IP_SALT = process.env.ANALYTICS_IP_SALT || 'forke-default-rotate-me'

/**
 * One-way, salted SHA-256 of an IP address. We store ONLY this — never the raw IP.
 * Same IP always hashes to the same value (so we can still spot "many accounts, one IP"),
 * but the hash can't be reversed back to an address.
 */
export function hashIp(ip?: string | null): string | null {
  if (!ip) return null
  const clean = ip.split(',')[0].trim() // x-forwarded-for can be a list; take the client IP
  if (!clean) return null
  return createHash('sha256').update(IP_SALT + clean).digest('hex')
}

/** Pull the client IP from standard proxy headers (Vercel / nginx / RDS proxy). */
export function getClientIp(headers: Headers): string | null {
  return (
    headers.get('x-forwarded-for') ||
    headers.get('x-real-ip') ||
    null
  )
}

/** Coarse country from edge geo headers (Vercel sets x-vercel-ip-country). No IP retained. */
export function getCountry(headers: Headers): string | null {
  return (
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    null
  )
}

// Conservative bot match — keeps obvious crawlers out of the human click charts without
// trying to be a full bot-detection system.
const BOT_UA = /bot|crawl|spider|slurp|bing|google|yandex|baidu|duckduck|facebookexternalhit|preview|monitor|curl|wget|python-requests|headless|lighthouse|pingdom|uptime/i

export function isBotUserAgent(ua?: string | null): boolean {
  if (!ua) return true // no UA at all is almost always a script/scanner
  return BOT_UA.test(ua)
}
