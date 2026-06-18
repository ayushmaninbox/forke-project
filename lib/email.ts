/**
 * Forke transactional email system.
 *
 * Design language mirrors the marketing site's "ledger" aesthetic:
 *  - dark canvas (#050505) with a single hairline-bordered card (#0A0A0B)
 *  - the `forke*` wordmark (lowercase, accent asterisk) instead of a heavy logo lockup
 *  - a mono eyebrow (NN ── LABEL) marking each message, like the site's <Eyebrow>
 *  - headings in Geist/system sans-medium with one serif-italic accent word
 *  - flat, refined buttons (no 3D drop-shadow / chunky uppercase) — felt, not shouted
 *  - accent #FF7A00, muted body copy, generous spacing
 *
 * All markup is inline-styled table HTML for broad email-client support. Web fonts
 * aren't reliable in email, so we use a system sans stack for UI/body and Georgia
 * as the serif stand-in for Instrument Serif's editorial italics.
 */

// ----------------------------------------------------------------------------
// Brand tokens (inlined everywhere — email clients ignore <style>/variables)
// ----------------------------------------------------------------------------
const BRAND = {
  accent: '#FF7A00',
  accentDeep: '#E66E00',
  canvas: '#050505',
  card: '#0A0A0B',
  cardSoft: '#0E0E10',
  hairline: 'rgba(255,255,255,0.08)',
  hairlineSoft: 'rgba(255,255,255,0.05)',
  textHigh: '#F5F5F7',
  textBody: 'rgba(255,255,255,0.55)',
  textMuted: 'rgba(255,255,255,0.40)',
  textFaint: 'rgba(255,255,255,0.28)',
  sans: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  serif: "Georgia,'Times New Roman',serif",
  mono: "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace",
  baseUrl: 'https://forke.space',
}

// ----------------------------------------------------------------------------
// Reusable markup primitives
// ----------------------------------------------------------------------------

/** The `forke*` wordmark — lowercase, tight tracking, accent asterisk. */
function wordmark(size = 22): string {
  return `<span style="font-family:${BRAND.sans};font-size:${size}px;font-weight:600;letter-spacing:-0.04em;color:${BRAND.textHigh};line-height:1;">forke<span style="color:${BRAND.accent};">*</span></span>`
}

/** Mono eyebrow: NN ──── LABEL, matching the site's <Eyebrow>. */
function eyebrow(n: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px 0;">
      <tr>
        <td style="font-family:${BRAND.mono};font-size:11px;letter-spacing:0.08em;color:${BRAND.accent};opacity:0.85;padding-right:10px;vertical-align:middle;">${n}</td>
        <td style="vertical-align:middle;padding-right:10px;"><div style="width:32px;height:1px;background:rgba(255,255,255,0.18);font-size:0;line-height:0;">&nbsp;</div></td>
        <td style="font-family:${BRAND.mono};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.textMuted};vertical-align:middle;">${label}</td>
      </tr>
    </table>
  `
}

/** Section heading: sans-medium with one serif-italic accent word/clause. */
function heading(lead: string, accent: string, size = 30): string {
  return `
    <h1 style="font-family:${BRAND.sans};font-size:${size}px;font-weight:500;letter-spacing:-0.035em;line-height:1.1;color:${BRAND.textHigh};margin:0 0 18px 0;">
      ${lead} <span style="font-family:${BRAND.serif};font-style:italic;font-weight:400;color:${BRAND.accent};letter-spacing:0;">${accent}</span>
    </h1>
  `
}

/** Body paragraph. */
function p(text: string, mb = 18): string {
  return `<p style="font-family:${BRAND.sans};font-size:15px;line-height:1.7;color:${BRAND.textBody};margin:0 0 ${mb}px 0;font-weight:400;">${text}</p>`
}

/** Flat, refined primary button (filled accent). */
function buttonPrimary(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 4px 0;">
      <tr>
        <td align="center" style="border-radius:10px;background:${BRAND.accent};">
          <a href="${href}" target="_blank" style="display:inline-block;padding:13px 26px;font-family:${BRAND.sans};font-size:14px;font-weight:600;letter-spacing:-0.01em;color:#0A0A0B;text-decoration:none;border-radius:10px;white-space:nowrap;">${label}&nbsp;&rarr;</a>
        </td>
      </tr>
    </table>
  `
}

/** Flat, refined secondary button (hairline outline). */
function buttonGhost(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 4px 0;">
      <tr>
        <td align="center" style="border-radius:10px;border:1px solid ${BRAND.hairline};background:rgba(255,255,255,0.02);">
          <a href="${href}" target="_blank" style="display:inline-block;padding:12px 24px;font-family:${BRAND.sans};font-size:14px;font-weight:500;letter-spacing:-0.01em;color:${BRAND.textHigh};text-decoration:none;border-radius:10px;white-space:nowrap;">${label}</a>
        </td>
      </tr>
    </table>
  `
}

/** Subtle "paste this link" fallback line under a button. */
function fallbackLink(href: string): string {
  return `<p style="font-family:${BRAND.sans};font-size:12px;line-height:1.7;color:${BRAND.textFaint};margin:14px 0 0 0;font-weight:400;">Button not working? Paste this into your browser:<br><a href="${href}" style="color:${BRAND.accent};text-decoration:none;word-break:break-all;">${href}</a></p>`
}

/** An accent-tinted callout box (used for reasons, key facts). */
function calloutBox(label: string, body: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px 0;">
      <tr>
        <td style="background:rgba(255,122,0,0.04);border:1px solid rgba(255,122,0,0.18);border-radius:12px;padding:16px 18px;">
          <p style="font-family:${BRAND.mono};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;color:${BRAND.accent};margin:0 0 8px 0;">${label}</p>
          <p style="font-family:${BRAND.sans};font-size:14px;line-height:1.65;color:rgba(255,255,255,0.72);margin:0;font-weight:400;">${body}</p>
        </td>
      </tr>
    </table>
  `
}

/** A row of feature "pills" (ledger chips). `items` is an array of labels. */
function featurePills(items: string[]): string {
  const cells = items
    .map(
      (item) => `
      <!--[if mso]></td><td style="padding:0 4px;"><![endif]-->
      <div style="display:inline-block;background:rgba(255,255,255,0.02);border:1px solid ${BRAND.hairline};border-radius:999px;padding:7px 14px;margin:4px;font-family:${BRAND.sans};font-size:12px;font-weight:500;color:rgba(255,255,255,0.6);">
        <span style="color:${BRAND.accent};font-weight:700;">+</span>&nbsp; ${item}
      </div>`
    )
    .join('')
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" style="margin:4px 0 28px 0;">
      <tr><td align="left" style="font-size:0;">
        <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0 4px;"><![endif]-->
        ${cells}
        <!--[if mso]></td></tr></table><![endif]-->
      </td></tr>
    </table>
  `
}

/** A thin hairline divider. */
function divider(mt = 8, mb = 24): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${mt}px 0 ${mb}px 0;"><tr><td style="height:1px;background:${BRAND.hairlineSoft};font-size:0;line-height:0;">&nbsp;</td></tr></table>`
}

/**
 * The shared email shell — dark canvas, single hairline card, optional banner,
 * wordmark header bar, slot for body, and a consistent footer.
 */
function emailShell(opts: {
  title: string
  preheader?: string
  banner?: string
  bodyHtml: string
  footerLabel: string
  /** Optional extra <style> injected into <head> (progressive-enhancement only). */
  headStyle?: string
  /** Optional HTML appended in the footer (e.g. an unsubscribe line for broadcasts). */
  footerExtra?: string
}): string {
  const bannerRow = opts.banner
    ? `<tr><td align="center" style="padding:0;line-height:0;font-size:0;">
         <img src="${BRAND.baseUrl}/forke-assets/email-banners/${opts.banner}" alt="Forke" width="600" style="width:100%;max-width:600px;height:auto;display:block;border-bottom:1px solid ${BRAND.hairlineSoft};" />
       </td></tr>`
    : ''

  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${opts.preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark only">
    <meta name="supported-color-schemes" content="dark">
    <title>${opts.title}</title>
    <!--[if mso]><style>table,td,a{font-family:Arial,Helvetica,sans-serif !important;}</style><![endif]-->
    ${opts.headStyle ? `<style>${opts.headStyle}</style>` : ''}
  </head>
  <body style="margin:0;padding:0;background:${BRAND.canvas};-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;">
    ${preheader}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.canvas};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:${BRAND.card};border:1px solid ${BRAND.hairline};border-radius:20px;overflow:hidden;">

            <!-- Header bar: wordmark + tiny mono tag -->
            <tr>
              <td style="padding:22px 32px;border-bottom:1px solid ${BRAND.hairlineSoft};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" style="vertical-align:middle;">${wordmark(22)}</td>
                    <td align="right" style="vertical-align:middle;font-family:${BRAND.mono};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.textFaint};">prove skill by shipping</td>
                  </tr>
                </table>
              </td>
            </tr>

            ${bannerRow}

            <!-- Body -->
            <tr>
              <td style="padding:40px 32px 36px 32px;">
                ${opts.bodyHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 32px 30px 32px;border-top:1px solid ${BRAND.hairlineSoft};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" style="vertical-align:top;">
                      ${wordmark(16)}
                      <p style="font-family:${BRAND.sans};font-size:12px;line-height:1.6;color:${BRAND.textFaint};margin:8px 0 0 0;">
                        The micro-task marketplace for developers.<br>
                        <a href="mailto:support@forke.space" style="color:${BRAND.textMuted};text-decoration:none;">support@forke.space</a>
                      </p>
                    </td>
                    <td align="right" style="vertical-align:top;">
                      <a href="https://www.linkedin.com/company/forke/" style="font-family:${BRAND.mono};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.textMuted};text-decoration:none;">LinkedIn &rarr;</a>
                    </td>
                  </tr>
                </table>
                <p style="font-family:${BRAND.mono};font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.22em;color:rgba(255,255,255,0.20);margin:22px 0 0 0;">
                  &copy; 2026 Forke &nbsp;&middot;&nbsp; ${opts.footerLabel}
                </p>
                ${opts.footerExtra ?? ''}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

// ----------------------------------------------------------------------------
// Resend transport helpers (quote-stripping kept identical to before)
// ----------------------------------------------------------------------------

function resolveResendApiKey(): string {
  let apiKey = process.env.RESEND_API_KEY || ''
  if (apiKey.startsWith('"') && apiKey.endsWith('"')) apiKey = apiKey.slice(1, -1)
  if (apiKey.startsWith("'") && apiKey.endsWith("'")) apiKey = apiKey.slice(1, -1)
  return apiKey
}

function resolveFromEmail(): string {
  let fromEmail = process.env.WAITLIST_EMAIL_FROM || 'Forke <onboarding@resend.dev>'
  if (fromEmail.startsWith('"') && fromEmail.endsWith('"')) fromEmail = fromEmail.slice(1, -1)
  if (fromEmail.startsWith("'") && fromEmail.endsWith("'")) fromEmail = fromEmail.slice(1, -1)
  return fromEmail
}

function resolveBaseUrl(): string {
  let baseUrl = process.env.AUTH_URL || 'https://forke.space'
  if (baseUrl.startsWith('"') && baseUrl.endsWith('"')) baseUrl = baseUrl.slice(1, -1)
  if (baseUrl.startsWith("'") && baseUrl.endsWith("'")) baseUrl = baseUrl.slice(1, -1)
  return baseUrl.replace(/\/$/, '')
}

/**
 * Posts an email through Resend. Fail-soft: logs and returns false, never throws,
 * so a Resend outage can never block the underlying action.
 */
/**
 * Low-level single send. Returns a structured result so callers can tell a
 * transient failure (429 / 5xx — worth retrying) from a permanent one.
 */
async function sendResendEmailResult(
  toEmail: string,
  subject: string,
  html: string,
  label: string,
  fromEmail?: string
): Promise<{ ok: boolean; retryable: boolean; retryAfterMs?: number }> {
  const apiKey = resolveResendApiKey()
  if (!apiKey) {
    console.warn(`⚠️ RESEND_API_KEY is not configured. Skipping ${label} email.`)
    return { ok: false, retryable: false }
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail || resolveFromEmail(),
        to: toEmail,
        reply_to: 'support@forke.space',
        subject,
        html,
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      console.error(`Failed to send ${label} email via Resend (${res.status}):`, errText)
      // 429 (rate limit) and 5xx are transient — safe to retry.
      const retryable = res.status === 429 || res.status >= 500
      const retryHeader = res.headers.get('retry-after')
      const retryAfterMs = retryHeader ? Number(retryHeader) * 1000 : undefined
      return { ok: false, retryable, retryAfterMs }
    }
    return { ok: true, retryable: false }
  } catch (error) {
    console.error(`Error dispatching ${label} email:`, error)
    // Network errors are transient too.
    return { ok: false, retryable: true }
  }
}

async function sendResendEmail(
  toEmail: string,
  subject: string,
  html: string,
  label: string,
  fromEmail?: string
): Promise<boolean> {
  const { ok } = await sendResendEmailResult(toEmail, subject, html, label, fromEmail)
  return ok
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ----------------------------------------------------------------------------
// Email builders — exported so the /email preview page can render them too.
// Each returns the full HTML string for one message.
// ----------------------------------------------------------------------------

export function buildWelcomeEmail(): string {
  return emailShell({
    title: 'Welcome to the Forke Waitlist',
    preheader: 'You’re on the list. Prepare your editor — something big is about to drop.',
    banner: 'main-banner.png',
    footerLabel: 'Waitlist Confirmation',
    bodyHtml: `
      ${eyebrow('001', 'waitlist')}
      ${heading('You’re on the list.', 'Build the future.')}
      ${p('Thanks for joining early. Forke is the micro-task marketplace where developers claim real bounties, ship real code, and get paid instantly over UPI — no fake projects, no proposals, no waiting.')}
      ${p('We’ll email you the moment your workspace is ready. Until then, prepare your editor.')}
      ${featurePills(['Real-world tasks', 'Verified contributions', 'Instant payouts'])}
      ${buttonPrimary('https://www.linkedin.com/company/forke/', 'Follow along on LinkedIn')}
      ${divider(24, 22)}
      ${p('Questions or feedback? Just reply to this email or reach us at <a href="mailto:support@forke.space" style="color:' + BRAND.accent + ';text-decoration:none;">support@forke.space</a>.', 0)}
    `,
  })
}

export function buildAdminInvitationEmail(name: string, inviteLink: string): string {
  return emailShell({
    title: 'Forke — Administrative Invitation',
    preheader: 'You’ve been invited to the Forke admin console. Set up your account to get started.',
    banner: 'admin-approval.png',
    footerLabel: 'Secure System Access',
    bodyHtml: `
      ${eyebrow('001', 'admin access')}
      ${heading('You’re invited.', 'Access granted.')}
      ${p(`Hello ${name},`)}
      ${p('You’ve been invited to the Forke admin console. As a member, you can configure settings, manage users, and oversee platform operations.')}
      ${p('Set up your secure username and password to activate your session:')}
      ${buttonPrimary(inviteLink, 'Activate admin account')}
      ${fallbackLink(inviteLink)}
    `,
  })
}

export function buildAccountDeletionScheduledEmail(): string {
  return emailShell({
    title: 'Forke — Account Deletion Scheduled',
    preheader: 'Your account is scheduled for deletion in 30 days. Sign back in to cancel.',
    banner: 'main-banner.png',
    footerLabel: 'Account Deletion Schedule',
    bodyHtml: `
      ${eyebrow('001', 'account')}
      ${heading('Deletion scheduled.', '30 days remaining.')}
      ${p('Hello,')}
      ${p('We received a request to delete your Forke account. Per our security policy, it’s scheduled for permanent deletion in <strong style="color:' + BRAND.textHigh + ';font-weight:600;">30 days</strong>.')}
      ${calloutBox('Changed your mind?', 'Simply sign back in with your usual credentials any time before the window closes — that automatically cancels the deletion.')}
      ${p('No action is needed if you wish to proceed. Your data will be permanently erased after 30 days.', 0)}
    `,
  })
}

export function buildOwnerApprovedEmail(name: string, signInLink: string): string {
  return emailShell({
    title: 'Forke — Your Owner Account is Approved',
    preheader: 'Your owner application is approved. Your dashboard is ready.',
    banner: 'owner-approved.png',
    footerLabel: 'Owner Access Granted',
    bodyHtml: `
      ${eyebrow('001', 'application')}
      ${heading('Application approved.', 'Welcome aboard.')}
      ${p(`Hello ${name},`)}
      ${p('Great news — your owner application has been reviewed and <strong style="color:' + BRAND.textHigh + ';font-weight:600;">approved</strong>. You now have full access to the Forke owner dashboard, where you can post tasks, review submissions, and collaborate with developers.')}
      ${buttonPrimary(signInLink, 'Enter owner dashboard')}
      ${fallbackLink(signInLink)}
    `,
  })
}

export function buildOwnerDeclinedEmail(name: string, reason: string, applyLink: string): string {
  const safeReason = (reason || '').trim() || 'Your application did not meet our current onboarding criteria.'
  return emailShell({
    title: 'Forke — Owner Application Update',
    preheader: 'An update on your Forke owner application.',
    banner: 'owner-rejected.png',
    footerLabel: 'Owner Application Review',
    bodyHtml: `
      ${eyebrow('001', 'application')}
      ${heading('Application update.', 'You can apply again.')}
      ${p(`Hello ${name},`)}
      ${p('Thank you for your interest in becoming an owner on Forke. After review, we weren’t able to approve your application at this time.')}
      ${calloutBox('Reason', safeReason)}
      ${p('You’re welcome to address the above and re-apply whenever you’re ready — we’d be glad to take another look.')}
      ${buttonGhost(applyLink, 'Apply again')}
      ${fallbackLink(applyLink)}
    `,
  })
}

export function buildBannedEmail(name: string, accountKind: 'owner' | 'developer', reviewLink: string): string {
  return emailShell({
    title: 'Forke — Account Suspended',
    preheader: 'Your account has been suspended. You can request a review.',
    banner: 'user-ban.png',
    footerLabel: 'Account Suspension Notice',
    bodyHtml: `
      ${eyebrow('001', 'account')}
      ${heading('Account suspended.', 'You can request a review.')}
      ${p(`Hello ${name},`)}
      ${p(`Your Forke ${accountKind} account has been <strong style="color:${BRAND.textHigh};font-weight:600;">suspended</strong> and access is temporarily restricted. This can follow a policy review or activity that needs further verification.`)}
      ${p('If you believe this was a mistake, submit a request for review below and our team will look into it:')}
      ${buttonPrimary(reviewLink, 'Request a review')}
      ${fallbackLink(reviewLink)}
    `,
  })
}

export interface BlogEmailData {
  title: string
  excerpt?: string | null
  coverImage?: string | null
  authorName?: string | null
  readingMinutes?: number | null
  publishedAt?: Date | string | null
  url: string
  /**
   * When true, append an unsubscribe footer. Resend's Broadcasts API REQUIRES an
   * unsubscribe link and substitutes the {{{RESEND_UNSUBSCRIBE_URL}}} token at
   * send time. Off for the preview page / any 1:1 use.
   */
  unsubscribe?: boolean
}

function formatBlogDate(value: Date | string | null | undefined): string | null {
  if (!value) return null
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * New-blog announcement — echoes the public blog page's featured card: a cover
 * hero, a mono meta row, a serif title, the excerpt, and a "Read more" button.
 *
 * Progressive fade-in: each block is wrapped in a `.fx` class that the <head>
 * <style> starts at opacity:0 and eases to 1 with a staggered delay, the button
 * (`.fx-cta`) revealing last. Clients that strip <style> (Gmail) ignore all of
 * it and render everything visible immediately — so nothing is ever hidden.
 */
export function buildBlogEmail(data: BlogEmailData): string {
  const dateStr = formatBlogDate(data.publishedAt)
  const minutes = data.readingMinutes && data.readingMinutes > 0 ? data.readingMinutes : 1

  const cover = data.coverImage
    ? `<a href="${data.url}" target="_blank" style="text-decoration:none;display:block;"><img src="${data.coverImage}" alt="${data.title}" width="536" style="width:100%;max-width:536px;height:auto;display:block;border-radius:14px;border:1px solid ${BRAND.hairline};" /></a>`
    : `<a href="${data.url}" target="_blank" style="text-decoration:none;display:block;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:14px;border:1px solid ${BRAND.hairline};background:rgba(255,255,255,0.02);"><tr><td align="center" style="height:200px;font-family:${BRAND.serif};font-size:64px;color:rgba(255,255,255,0.10);">F</td></tr></table></a>`

  const metaParts = [
    `<span style="color:${BRAND.accent};text-transform:uppercase;letter-spacing:0.12em;">New post</span>`,
    dateStr ? `<span style="color:rgba(255,255,255,0.18);">&middot;</span> <span>${dateStr}</span>` : '',
    `<span style="color:rgba(255,255,255,0.18);">&middot;</span> <span>${minutes} min read</span>`,
  ]
    .filter(Boolean)
    .join(' ')

  const excerpt = data.excerpt?.trim()
    ? `<p class="fx fx-3" style="font-family:${BRAND.sans};font-size:15px;line-height:1.7;color:${BRAND.textBody};margin:0 0 26px 0;font-weight:400;">${data.excerpt.trim()}</p>`
    : ''

  const authorRow = data.authorName?.trim()
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 4px 0;"><tr>
         <td style="vertical-align:middle;"><div style="width:26px;height:26px;border-radius:999px;background:rgba(255,122,0,0.12);border:1px solid rgba(255,122,0,0.3);font-family:${BRAND.sans};font-size:12px;font-weight:600;color:${BRAND.accent};text-align:center;line-height:26px;">${data.authorName.trim().charAt(0).toUpperCase()}</div></td>
         <td style="vertical-align:middle;padding-left:10px;font-family:${BRAND.sans};font-size:13px;color:${BRAND.textMuted};">${data.authorName.trim()}</td>
       </tr></table>`
    : ''

  // Staggered fade-in. Base = visible (no opacity inline); .fx classes only take
  // effect where <style> + CSS animations are honored.
  const headStyle = `
    @media (prefers-reduced-motion: no-preference) {
      .fx { opacity: 0; animation: forkeFade 0.9s ease-out forwards; }
      .fx-1 { animation-delay: 0.05s; }
      .fx-2 { animation-delay: 0.35s; }
      .fx-3 { animation-delay: 0.65s; }
      .fx-4 { animation-delay: 0.95s; }
      .fx-cta { opacity: 0; animation: forkeRise 1s ease-out 1.35s forwards; }
    }
    @keyframes forkeFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes forkeRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  `

  // Broadcasts require an unsubscribe link; Resend swaps the token at send time.
  const footerExtra = data.unsubscribe
    ? `<p style="font-family:${BRAND.sans};font-size:11px;line-height:1.6;color:${BRAND.textFaint};margin:14px 0 0 0;">
         You're receiving this because you subscribed to Forke updates.
         <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:${BRAND.textMuted};text-decoration:underline;">Unsubscribe</a>.
       </p>`
    : ''

  return emailShell({
    title: data.title,
    preheader: data.excerpt?.trim() || `New on the Forke blog: ${data.title}`,
    footerLabel: 'New Blog Post',
    headStyle,
    footerExtra,
    bodyHtml: `
      <div class="fx fx-1" style="margin:0 0 22px 0;">${cover}</div>
      <div class="fx fx-2" style="font-family:${BRAND.mono};font-size:11px;letter-spacing:0.04em;color:rgba(255,255,255,0.40);margin:0 0 14px 0;">${metaParts}</div>
      <h1 class="fx fx-2" style="font-family:${BRAND.serif};font-size:30px;font-weight:400;line-height:1.18;color:${BRAND.textHigh};margin:0 0 18px 0;">
        <a href="${data.url}" target="_blank" style="color:${BRAND.textHigh};text-decoration:none;">${data.title}</a>
      </h1>
      ${excerpt}
      <div class="fx fx-4">${authorRow}</div>
      <div class="fx-cta" style="margin-top:14px;">
        ${buttonPrimary(data.url, 'Read more')}
      </div>
    `,
  })
}

// ----------------------------------------------------------------------------
// Public senders — signatures, subjects, and from-addresses unchanged.
// ----------------------------------------------------------------------------

export async function sendWelcomeEmail(toEmail: string): Promise<boolean> {
  return sendResendEmail(
    toEmail,
    'Welcome to the Forke Waitlist!',
    buildWelcomeEmail(),
    'welcome',
    'Forke Waitlist <waitlist@forke.space>'
  )
}

// ----------------------------------------------------------------------------
// Resend Broadcasts API — for BULK subscriber sends (e.g. blog announcements).
// Unlike the per-recipient /emails endpoint (metered against the daily quota),
// a broadcast goes to a whole audience in one operation, shows up under the
// "Broadcasts" tab, and is the right tool for newsletters. Subscribers live in
// our Postgres `subscribers` table — NOT in Resend — so before sending we sync
// the DB emails into a Resend audience as contacts.
// ----------------------------------------------------------------------------

const RESEND_API = 'https://api.resend.com'

function resolveAudienceId(): string {
  let id = process.env.RESEND_AUDIENCE_ID || ''
  if (id.startsWith('"') && id.endsWith('"')) id = id.slice(1, -1)
  if (id.startsWith("'") && id.endsWith("'")) id = id.slice(1, -1)
  return id.trim()
}

async function resendFetch(path: string, init: RequestInit, apiKey: string) {
  return fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(init.headers || {}),
    },
  })
}

/** Ensure an audience exists; returns its id. Uses RESEND_AUDIENCE_ID if set. */
async function ensureAudience(apiKey: string): Promise<string | null> {
  const configured = resolveAudienceId()
  if (configured) return configured
  // No id configured — create a default audience so the flow still works.
  try {
    const res = await resendFetch('/audiences', {
      method: 'POST',
      body: JSON.stringify({ name: 'Forke Subscribers' }),
    }, apiKey)
    if (!res.ok) {
      console.error('Failed to create Resend audience:', await res.text())
      return null
    }
    const json = (await res.json()) as { id?: string }
    console.warn(`Created Resend audience ${json.id}. Set RESEND_AUDIENCE_ID=${json.id} to reuse it.`)
    return json.id ?? null
  } catch (err) {
    console.error('Error creating Resend audience:', err)
    return null
  }
}

/**
 * Sync DB subscriber emails into a Resend audience as contacts. Idempotent:
 * Resend treats re-adding an existing contact as a no-op (we ignore 409/already
 * exists). Paced lightly to be polite to the API.
 */
async function syncContactsToAudience(audienceId: string, emails: string[], apiKey: string): Promise<number> {
  let synced = 0
  for (const email of emails) {
    try {
      const res = await resendFetch(`/audiences/${audienceId}/contacts`, {
        method: 'POST',
        body: JSON.stringify({ email, unsubscribed: false }),
      }, apiKey)
      // 200/201 = created; 409/422 = already a contact — both are fine.
      if (res.ok || res.status === 409 || res.status === 422) synced++
      else console.warn(`Contact sync for ${email} returned ${res.status}:`, await res.text())
    } catch (err) {
      console.warn(`Contact sync threw for ${email}:`, err)
    }
    await sleep(120)
  }
  return synced
}

/**
 * Announce a newly-published blog to every subscriber via Resend's Broadcasts
 * API (one audience send — does NOT burn the per-recipient daily quota). Fully
 * fail-soft: a missing key/audience or a Resend hiccup logs and returns a zero
 * result; it must never block or throw into the blog-publish action.
 *
 * The DB import is lazy so this module stays importable in non-DB contexts
 * (e.g. the email preview page renders builders without ever touching Postgres).
 */
export async function sendBlogPublishedBroadcast(blog: {
  id?: string
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: string | null
  authorName?: string | null
  readingMinutes?: number | null
  publishedAt?: Date | string | null
}): Promise<{ success: boolean; sentCount: number; broadcastId?: string }> {
  const apiKey = resolveResendApiKey()
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is not configured. Skipping blog broadcast.')
    return { success: false, sentCount: 0 }
  }

  // Resolve recipients from our DB (de-duplicated, case-insensitive).
  const emails: string[] = []
  try {
    const { db } = await import('./db')
    const { subscribers } = await import('./db/schema')
    const rows = await db.select({ email: subscribers.email }).from(subscribers)
    const seen = new Set<string>()
    for (const r of rows) {
      const e = r.email?.trim()
      if (!e) continue
      const key = e.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      emails.push(e)
    }
  } catch (err) {
    console.error('Failed to load subscribers for blog broadcast:', err)
    return { success: false, sentCount: 0 }
  }
  if (emails.length === 0) return { success: true, sentCount: 0 }

  // 1) Ensure an audience and 2) sync our subscribers into it as contacts.
  const audienceId = await ensureAudience(apiKey)
  if (!audienceId) return { success: false, sentCount: 0 }
  const synced = await syncContactsToAudience(audienceId, emails, apiKey)

  const url = `${resolveBaseUrl()}/blogs/${blog.slug}`
  const html = buildBlogEmail({
    title: blog.title,
    excerpt: blog.excerpt,
    coverImage: blog.coverImage,
    authorName: blog.authorName,
    readingMinutes: blog.readingMinutes,
    publishedAt: blog.publishedAt,
    url,
    unsubscribe: true, // Broadcasts API requires an unsubscribe link.
  })
  const subject = `New on the Forke blog: ${blog.title}`

  try {
    // 3) Create the broadcast against the audience.
    const createRes = await resendFetch('/broadcasts', {
      method: 'POST',
      body: JSON.stringify({
        audience_id: audienceId,
        from: 'Forke Blog <blog@forke.space>',
        reply_to: 'support@forke.space',
        subject,
        html,
        name: `Blog: ${blog.title}`,
      }),
    }, apiKey)
    if (!createRes.ok) {
      console.error('Failed to create Resend broadcast:', await createRes.text())
      return { success: false, sentCount: 0 }
    }
    const broadcast = (await createRes.json()) as { id: string }
    const broadcastId = broadcast.id

    // 4) Send it now.
    const sendRes = await resendFetch(`/broadcasts/${broadcastId}/send`, {
      method: 'POST',
      body: JSON.stringify({}),
    }, apiKey)
    if (!sendRes.ok) {
      console.error('Failed to send Resend broadcast:', await sendRes.text())
      return { success: false, sentCount: 0, broadcastId }
    }

    console.log(`Blog broadcast sent to audience ${audienceId} (${synced} contacts).`)
    return { success: true, sentCount: synced, broadcastId }
  } catch (err) {
    console.error('Error dispatching blog broadcast:', err)
    return { success: false, sentCount: 0 }
  }
}

export async function sendAdminInvitation(
  toEmail: string,
  name: string,
  inviteLink: string
): Promise<boolean> {
  return sendResendEmail(
    toEmail,
    'Action Required: Complete your Forke Admin Setup',
    buildAdminInvitationEmail(name, inviteLink),
    'admin invitation',
    'Forke Onboarding <onboarding@forke.space>'
  )
}

export async function sendAccountDeletionScheduledEmail(toEmail: string): Promise<boolean> {
  return sendResendEmail(
    toEmail,
    'Forke: Your account deletion has been scheduled',
    buildAccountDeletionScheduledEmail(),
    'deletion scheduled',
    'Forke Security <security@forke.space>'
  )
}

export async function sendOwnerApprovedEmail(toEmail: string, name: string): Promise<boolean> {
  const signInLink = `${resolveBaseUrl()}/signin`
  return sendResendEmail(
    toEmail,
    'Your Forke owner account is approved',
    buildOwnerApprovedEmail(name, signInLink),
    'owner approval',
    'Forke Approvals <approvals@forke.space>'
  )
}

export async function sendOwnerDeclinedEmail(toEmail: string, name: string, reason: string): Promise<boolean> {
  const applyLink = `${resolveBaseUrl()}/signin`
  return sendResendEmail(
    toEmail,
    'Update on your Forke owner application',
    buildOwnerDeclinedEmail(name, reason, applyLink),
    'owner decline',
    'Forke Approvals <approvals@forke.space>'
  )
}

async function sendBannedEmail(toEmail: string, name: string, accountKind: 'owner' | 'developer'): Promise<boolean> {
  const reviewLink = `${resolveBaseUrl()}/auth-error?error=AccessDenied`
  return sendResendEmail(
    toEmail,
    'Your Forke account has been suspended',
    buildBannedEmail(name, accountKind, reviewLink),
    `${accountKind} ban`,
    'Forke Bans <bans@forke.space>'
  )
}

export async function sendOwnerBannedEmail(toEmail: string, name: string): Promise<boolean> {
  return sendBannedEmail(toEmail, name, 'owner')
}

export async function sendDeveloperBannedEmail(toEmail: string, name: string): Promise<boolean> {
  return sendBannedEmail(toEmail, name, 'developer')
}
