export async function sendWelcomeEmail(toEmail: string): Promise<boolean> {
  // Safe quote-stripping logic for environment variables to work seamlessly across Vercel and local
  let apiKey = process.env.RESEND_API_KEY || ''
  if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
    apiKey = apiKey.slice(1, -1)
  }
  if (apiKey.startsWith("'") && apiKey.endsWith("'")) {
    apiKey = apiKey.slice(1, -1)
  }

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is not configured. Skipping welcome email.')
    return false
  }

  let fromEmail = process.env.WAITLIST_EMAIL_FROM || 'Forke <onboarding@resend.dev>'
  if (fromEmail.startsWith('"') && fromEmail.endsWith('"')) {
    fromEmail = fromEmail.slice(1, -1)
  }
  if (fromEmail.startsWith("'") && fromEmail.endsWith("'")) {
    fromEmail = fromEmail.slice(1, -1)
  }

  const bannerFile = 'main-banner.png'
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark only">
        <title>Welcome to the Forke Waitlist!</title>
        <!--[if mso]>
        <style>table,td{font-family:Arial,Helvetica,sans-serif;}</style>
        <![endif]-->
      </head>
      <body style="margin:0;padding:0;background-color:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050508;">
          <tr>
            <td align="center" style="padding:48px 16px;">
              <!-- Container Card -->
              <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background-color:#0A0A10;border:1px solid rgba(255,122,0,0.15);border-radius:24px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.85);">
                <!-- Banner -->
                <tr>
                  <td align="center" style="padding:0;line-height:0;font-size:0;">
                    <img src="https://forke.space/forke-assets/email-banners/${bannerFile}" alt="Forke Banner" width="580" style="width:100%;max-width:580px;height:auto;display:block;border-bottom:1px solid rgba(255,122,0,0.05);" />
                  </td>
                </tr>
                
                <!-- Content Padding Area -->
                <tr>
                  <td style="padding:48px 40px;text-align:center;">
                    <!-- Brand Logo -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 20px auto;">
                      <tr>
                        <td align="center">
                          <img src="https://forke.space/forke-assets/forke_logo.png" alt="Forke Logo" width="100" style="width:100px;height:auto;display:block;margin:0 auto;" />
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Primary Heading -->
                    <h1 style="font-family:Georgia,serif;font-size:30px;font-weight:normal;font-style:italic;line-height:1.3;color:#ffffff;margin:0 0 20px 0;">
                      Join the waitlist.<br><span style="color:#FF7A00;font-style:italic;">Build the future.</span>
                    </h1>
                    
                    <!-- Description Paragraphs -->
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
                      Thanks for joining early access. Forke is the premier micro-task marketplace where developers claim bounties, ship real code, and earn rewards.
                    </p>
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
                      We&apos;ll email you the exact moment we launch your workspace. In the meantime, prepare your editor. Something big is about to drop.
                    </p>
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 28px 0;font-weight:300;">
                      Have questions or feedback? Feel free to reach out to us at <a href="mailto:support@forke.space" style="color:#FF7A00;text-decoration:none;font-weight:500;">support@forke.space</a>.
                    </p>
                    
                    <!-- Features Checks -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 36px auto;">
                      <tr>
                        <td align="center" style="font-size:0;">
                          <!--[if mso]>
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                          <tr>
                          <td style="padding:4px 8px;">
                          <![endif]-->
                          <div style="display:inline-block;background-color:rgba(255,122,0,0.02);border:1px solid rgba(255,122,0,0.1);border-radius:20px;padding:8px 16px;margin:4px;font-size:11px;font-weight:bold;color:#a0a0ab;letter-spacing:0.02em;">
                            <span style="color:#FF7A00;margin-right:6px;font-weight:bold;">✓</span> Real-world tasks
                          </div>
                          <!--[if mso]>
                          </td><td style="padding:4px 8px;">
                          <![endif]-->
                          <div style="display:inline-block;background-color:rgba(255,122,0,0.02);border:1px solid rgba(255,122,0,0.1);border-radius:20px;padding:8px 16px;margin:4px;font-size:11px;font-weight:bold;color:#a0a0ab;letter-spacing:0.02em;">
                            <span style="color:#FF7A00;margin-right:6px;font-weight:bold;">✓</span> Verified contributions
                          </div>
                          <!--[if mso]>
                          </td><td style="padding:4px 8px;">
                          <![endif]-->
                          <div style="display:inline-block;background-color:rgba(255,122,0,0.02);border:1px solid rgba(255,122,0,0.1);border-radius:20px;padding:8px 16px;margin:4px;font-size:11px;font-weight:bold;color:#a0a0ab;letter-spacing:0.02em;">
                            <span style="color:#FF7A00;margin-right:6px;font-weight:bold;">✓</span> Fast payouts
                          </div>
                          <!--[if mso]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                        </td>
                      </tr>
                    </table>
                    
                    <!-- CTA Buttons -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 40px auto;">
                      <tr>
                        <!-- LinkedIn Button -->
                        <td align="center" style="padding:0 8px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center" style="background:linear-gradient(180deg,#FF7A00 0%,#D97706 100%);border-radius:12px;box-shadow:0 4px 0 #b45309;">
                                <a href="https://www.linkedin.com/company/forke/" target="_blank" style="display:inline-block;padding:16px 24px;font-size:11px;font-weight:900;color:#050505;text-decoration:none;text-transform:uppercase;letter-spacing:0.15em;border-radius:12px;border-bottom:2px solid rgba(0,0,0,0.25);white-space:nowrap;">
                                  Follow us on LinkedIn
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- Contact Us Button -->
                        <td align="center" style="padding:0 8px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center" style="background-color:rgba(255,122,0,0.03);border:1px solid rgba(255,122,0,0.3);border-radius:12px;box-shadow:0 4px 0 rgba(255,122,0,0.15);">
                                <a href="mailto:support@forke.space" style="display:inline-block;padding:15px 24px;font-size:11px;font-weight:900;color:#FF7A00;text-decoration:none;text-transform:uppercase;letter-spacing:0.15em;border-radius:12px;white-space:nowrap;">
                                  Contact Us
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Divider Line -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="height:1px;background-color:#1a1a24;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                    
                    <!-- Non-italicized Quote Footer with Styled HTML Heart (guarantees orange on all platforms) -->
                    <p style="font-family:Georgia,serif;font-size:14px;color:#555562;margin:0 0 16px 0;">
                      See you on the other side! <span style="color:#FF7A00;font-size:16px;font-weight:bold;line-height:1;vertical-align:middle;display:inline-block;">♥</span>
                    </p>
                    
                    <!-- Corporate Footer -->
                    <p style="font-size:9px;color:#40404a;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;margin:0;">
                      &copy; 2026 FORKE &middot; REAL CODE &middot; REAL REWARDS
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Forke Waitlist <waitlist@forke.space>',
        to: toEmail,
        reply_to: 'support@forke.space',
        subject: 'Welcome to the Forke Waitlist!',
        html: htmlContent,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Failed to send welcome email via Resend:', errText)
      return false
    }

    const data = await res.json()
    console.log('Welcome email dispatched successfully:', data.id)
    return true
  } catch (error) {
    console.error('Error dispatching welcome email:', error)
    return false
  }
}

export async function sendBroadcastEmail(
  toEmails: string[],
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; sentCount: number }> {
  let apiKey = process.env.RESEND_API_KEY || ''
  if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
    apiKey = apiKey.slice(1, -1)
  }
  if (apiKey.startsWith("'") && apiKey.endsWith("'")) {
    apiKey = apiKey.slice(1, -1)
  }

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is not configured. Skipping broadcast email.')
    return { success: false, sentCount: 0 }
  }

  let fromEmail = process.env.WAITLIST_EMAIL_FROM || 'Forke <onboarding@resend.dev>'
  if (fromEmail.startsWith('"') && fromEmail.endsWith('"')) {
    fromEmail = fromEmail.slice(1, -1)
  }
  if (fromEmail.startsWith("'") && fromEmail.endsWith("'")) {
    fromEmail = fromEmail.slice(1, -1)
  }

  let sentCount = 0
  for (const email of toEmails) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'Forke Updates <updates@forke.space>',
          to: email,
          reply_to: 'support@forke.space',
          subject: subject,
          html: htmlContent,
        }),
      })

      if (res.ok) {
        sentCount++
      } else {
        const errText = await res.text()
        console.error(`Failed to send broadcast email to ${email} via Resend:`, errText)
      }
    } catch (err) {
      console.error(`Error dispatching broadcast email to ${email}:`, err)
    }
  }

  return { success: sentCount > 0, sentCount }
}

export async function sendAdminInvitation(
  toEmail: string,
  name: string,
  inviteLink: string
): Promise<boolean> {
  let apiKey = process.env.RESEND_API_KEY || ''
  if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
    apiKey = apiKey.slice(1, -1)
  }
  if (apiKey.startsWith("'") && apiKey.endsWith("'")) {
    apiKey = apiKey.slice(1, -1)
  }

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is not configured. Skipping invitation email.')
    return false
  }

  let fromEmail = process.env.WAITLIST_EMAIL_FROM || 'Forke <onboarding@resend.dev>'
  if (fromEmail.startsWith('"') && fromEmail.endsWith('"')) {
    fromEmail = fromEmail.slice(1, -1)
  }
  if (fromEmail.startsWith("'") && fromEmail.endsWith("'")) {
    fromEmail = fromEmail.slice(1, -1)
  }

  const bannerFile = 'admin-approval.png'
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark only">
        <title>Forke - Administrative Invitation</title>
      </head>
      <body style="margin:0;padding:0;background-color:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050508;">
          <tr>
            <td align="center" style="padding:48px 16px;">
              <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background-color:#0A0A10;border:1px solid rgba(255,122,0,0.15);border-radius:24px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.85);">
                <tr>
                  <td align="center" style="padding:0;line-height:0;font-size:0;">
                    <img src="https://forke.space/forke-assets/email-banners/${bannerFile}" alt="Forke Banner" width="580" style="width:100%;max-width:580px;height:auto;display:block;border-bottom:1px solid rgba(255,122,0,0.05);" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:48px 40px;text-align:left;color:#ffffff;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                      <tr>
                        <td>
                          <img src="https://forke.space/forke-assets/forke_logo.png" alt="Forke Logo" width="80" style="width:80px;height:auto;display:block;" />
                        </td>
                      </tr>
                    </table>
                    
                    <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:normal;font-style:italic;line-height:1.3;color:#ffffff;margin:0 0 20px 0;">
                      Administrative invitation.<br><span style="color:#FF7A00;font-style:italic;">Access granted.</span>
                    </h1>
                    
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
                      Hello ${name},
                    </p>
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
                      You have been invited to join the administrative team at Forke. As a member of the console, you will possess administrative privileges to configure settings, manage users, and control system operations.
                    </p>
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 28px 0;font-weight:300;">
                      Please click the button below to establish your secure username and password to activate your administrative session:
                    </p>
                    
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 36px auto;">
                      <tr>
                        <td align="center" style="background:linear-gradient(180deg,#FF7A00 0%,#D97706 100%);border-radius:12px;box-shadow:0 4px 0 #b45309;">
                          <a href="${inviteLink}" target="_blank" style="display:inline-block;padding:16px 32px;font-size:11px;font-weight:900;color:#050505;text-decoration:none;text-transform:uppercase;letter-spacing:0.15em;border-radius:12px;border-bottom:2px solid rgba(0,0,0,0.25);white-space:nowrap;">
                            Activate Admin Account
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="font-size:12px;line-height:1.75;color:#60606b;margin:0 0 28px 0;font-weight:300;">
                      If the button above does not work, copy and paste this link in your browser:<br>
                      <a href="${inviteLink}" style="color:#FF7A00;text-decoration:none;word-break:break-all;">${inviteLink}</a>
                    </p>
                    
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="height:1px;background-color:#1a1a24;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                    
                    <p style="font-family:Georgia,serif;font-size:14px;color:#555562;margin:0 0 16px 0;text-align:center;">
                      See you on the other side! <span style="color:#FF7A00;font-size:16px;font-weight:bold;line-height:1;vertical-align:middle;display:inline-block;">♥</span>
                    </p>
                    <p style="font-size:9px;color:#40404a;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;margin:0;text-align:center;">
                      &copy; 2026 FORKE &middot; SECURE SYSTEM ACCESS
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Forke Onboarding <onboarding@forke.space>',
        to: toEmail,
        reply_to: 'support@forke.space',
        subject: 'Action Required: Complete your Forke Admin Setup',
        html: htmlContent,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Failed to send admin invitation email via Resend:', errText)
      return false
    }

    return true
  } catch (error) {
    console.error('Error dispatching admin invitation email:', error)
    return false
  }
}

export async function sendAccountDeletionScheduledEmail(toEmail: string): Promise<boolean> {
  let apiKey = process.env.RESEND_API_KEY || ''
  if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
    apiKey = apiKey.slice(1, -1)
  }
  if (apiKey.startsWith("'") && apiKey.endsWith("'")) {
    apiKey = apiKey.slice(1, -1)
  }

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is not configured. Skipping deletion scheduled email.')
    return false
  }

  let fromEmail = process.env.WAITLIST_EMAIL_FROM || 'Forke <onboarding@resend.dev>'
  if (fromEmail.startsWith('"') && fromEmail.endsWith('"')) {
    fromEmail = fromEmail.slice(1, -1)
  }
  if (fromEmail.startsWith("'") && fromEmail.endsWith("'")) {
    fromEmail = fromEmail.slice(1, -1)
  }

  const bannerFile = 'main-banner.png'
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark only">
        <title>Forke - Account Deletion Scheduled</title>
      </head>
      <body style="margin:0;padding:0;background-color:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050508;">
          <tr>
            <td align="center" style="padding:48px 16px;">
              <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background-color:#0A0A10;border:1px solid rgba(255,122,0,0.15);border-radius:24px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.85);">
                <tr>
                  <td align="center" style="padding:0;line-height:0;font-size:0;">
                    <img src="https://forke.space/forke-assets/email-banners/${bannerFile}" alt="Forke Banner" width="580" style="width:100%;max-width:580px;height:auto;display:block;border-bottom:1px solid rgba(255,122,0,0.05);" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:48px 40px;text-align:left;color:#ffffff;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                      <tr>
                        <td>
                          <img src="https://forke.space/forke-assets/forke_logo.png" alt="Forke Logo" width="80" style="width:80px;height:auto;display:block;" />
                        </td>
                      </tr>
                    </table>
                    
                    <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:normal;font-style:italic;line-height:1.3;color:#ffffff;margin:0 0 20px 0;">
                      Account deletion scheduled.<br><span style="color:#FF7A00;font-style:italic;">30 days remaining.</span>
                    </h1>
                    
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
                      Hello,
                    </p>
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
                      We received a request to delete your Forke account. In accordance with our security policies, your account has been scheduled for permanent deletion in <strong>30 days</strong>.
                    </p>
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
                      If this request was made in error or you have changed your mind, you can cancel this request at any time before the 30-day window expires. To do so, simply log back into your account using your standard credentials or connected accounts.
                    </p>
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 28px 0;font-weight:300;">
                      No further action is required if you wish to proceed with the deletion. Your data will be permanently erased after the 30-day period.
                    </p>
                    
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="height:1px;background-color:#1a1a24;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                    
                    <p style="font-family:Georgia,serif;font-size:14px;color:#555562;margin:0 0 16px 0;text-align:center;">
                      The Forke Team
                    </p>
                    <p style="font-size:9px;color:#40404a;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;margin:0;text-align:center;">
                      &copy; 2026 FORKE &middot; ACCOUNT DELETION SCHEDULE
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Forke Security <security@forke.space>',
        to: toEmail,
        reply_to: 'support@forke.space',
        subject: 'Forke: Your account deletion has been scheduled',
        html: htmlContent,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Failed to send deletion schedule email via Resend:', errText)
      return false
    }

    return true
  } catch (error) {
    console.error('Error dispatching deletion schedule email:', error)
    return false
  }
}

// --- Shared helpers for owner lifecycle emails ---------------------------------

// Resolves the Resend API key with the same quote-stripping the other senders use.
function resolveResendApiKey(): string {
  let apiKey = process.env.RESEND_API_KEY || ''
  if (apiKey.startsWith('"') && apiKey.endsWith('"')) apiKey = apiKey.slice(1, -1)
  if (apiKey.startsWith("'") && apiKey.endsWith("'")) apiKey = apiKey.slice(1, -1)
  return apiKey
}

// Resolves the "from" address with the same quote-stripping the other senders use.
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

// Wraps body markup in the standard dark Forke email shell (banner + logo + footer).
// `banner` is the email-banners filename (e.g. 'owner-approved.png'); defaults to main-banner.
function ownerEmailShell(opts: {
  title: string
  heading: string
  headingAccent: string
  bodyHtml: string
  footerLabel: string
  banner?: string
}): string {
  const bannerFile = opts.banner || 'main-banner.png'
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark only">
        <title>${opts.title}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050508;">
          <tr>
            <td align="center" style="padding:48px 16px;">
              <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background-color:#0A0A10;border:1px solid rgba(255,122,0,0.15);border-radius:24px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.85);">
                <tr>
                  <td align="center" style="padding:0;line-height:0;font-size:0;">
                    <img src="https://forke.space/forke-assets/email-banners/${bannerFile}" alt="Forke Banner" width="580" style="width:100%;max-width:580px;height:auto;display:block;border-bottom:1px solid rgba(255,122,0,0.05);" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:48px 40px;text-align:left;color:#ffffff;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                      <tr>
                        <td>
                          <img src="https://forke.space/forke-assets/forke_logo.png" alt="Forke Logo" width="80" style="width:80px;height:auto;display:block;" />
                        </td>
                      </tr>
                    </table>

                    <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:normal;font-style:italic;line-height:1.3;color:#ffffff;margin:0 0 20px 0;">
                      ${opts.heading}<br><span style="color:#FF7A00;font-style:italic;">${opts.headingAccent}</span>
                    </h1>

                    ${opts.bodyHtml}

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="height:1px;background-color:#1a1a24;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>

                    <p style="font-family:Georgia,serif;font-size:14px;color:#555562;margin:0 0 16px 0;text-align:center;">
                      The Forke Team <span style="color:#FF7A00;font-size:16px;font-weight:bold;line-height:1;vertical-align:middle;display:inline-block;">♥</span>
                    </p>
                    <p style="font-size:9px;color:#40404a;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;margin:0;text-align:center;">
                      &copy; 2026 FORKE &middot; ${opts.footerLabel}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

// Renders a standard orange CTA button used across the owner lifecycle emails.
function ctaButton(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 36px auto;">
      <tr>
        <td align="center" style="background:linear-gradient(180deg,#FF7A00 0%,#D97706 100%);border-radius:12px;box-shadow:0 4px 0 #b45309;">
          <a href="${href}" target="_blank" style="display:inline-block;padding:16px 32px;font-size:11px;font-weight:900;color:#050505;text-decoration:none;text-transform:uppercase;letter-spacing:0.15em;border-radius:12px;border-bottom:2px solid rgba(0,0,0,0.25);white-space:nowrap;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `
}

// Posts an email through Resend. Fail-soft: logs and returns false, never throws,
// so a Resend outage can never block the underlying DB action.
async function sendResendEmail(
  toEmail: string,
  subject: string,
  html: string,
  label: string,
  fromEmail?: string
): Promise<boolean> {
  const apiKey = resolveResendApiKey()
  if (!apiKey) {
    console.warn(`⚠️ RESEND_API_KEY is not configured. Skipping ${label} email.`)
    return false
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
        html
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      console.error(`Failed to send ${label} email via Resend:`, errText)
      return false
    }
    return true
  } catch (error) {
    console.error(`Error dispatching ${label} email:`, error)
    return false
  }
}

export async function sendOwnerApprovedEmail(toEmail: string, name: string): Promise<boolean> {
  const baseUrl = resolveBaseUrl()
  const signInLink = `${baseUrl}/signin`
  const html = ownerEmailShell({
    title: 'Forke - Your Owner Account is Approved',
    heading: 'Application approved.',
    headingAccent: 'Welcome aboard.',
    footerLabel: 'OWNER ACCESS GRANTED',
    banner: 'owner-approved.png',
    bodyHtml: `
      <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">Hello ${name},</p>
      <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
        Great news — your owner application has been reviewed and <strong style="color:#ffffff;">approved</strong>. You now have full access to the Forke owner dashboard, where you can post tasks, manage submissions, and collaborate with developers.
      </p>
      <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 28px 0;font-weight:300;">
        Click below to sign in and open your dashboard:
      </p>
      ${ctaButton(signInLink, 'Enter Owner Dashboard')}
      <p style="font-size:12px;line-height:1.75;color:#60606b;margin:0 0 28px 0;font-weight:300;">
        If the button does not work, paste this link into your browser:<br>
        <a href="${signInLink}" style="color:#FF7A00;text-decoration:none;word-break:break-all;">${signInLink}</a>
      </p>
    `,
  })
  return sendResendEmail(toEmail, 'Your Forke owner account is approved', html, 'owner approval', 'Forke Approvals <approvals@forke.space>')
}

export async function sendOwnerDeclinedEmail(toEmail: string, name: string, reason: string): Promise<boolean> {
  const baseUrl = resolveBaseUrl()
  const applyLink = `${baseUrl}/signin`
  const safeReason = (reason || '').trim() || 'Your application did not meet our current onboarding criteria.'
  const html = ownerEmailShell({
    title: 'Forke - Owner Application Update',
    heading: 'Application update.',
    headingAccent: 'You can apply again.',
    footerLabel: 'OWNER APPLICATION REVIEW',
    banner: 'owner-rejected.png',
    bodyHtml: `
      <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">Hello ${name},</p>
      <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
        Thank you for your interest in becoming an owner on Forke. After review, we were unable to approve your application at this time.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;">
        <tr>
          <td style="background-color:rgba(255,122,0,0.04);border:1px solid rgba(255,122,0,0.18);border-radius:12px;padding:16px 18px;">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FF7A00;margin:0 0 8px 0;">Reason</p>
            <p style="font-size:14px;line-height:1.7;color:#cfcfd6;margin:0;font-weight:300;">${safeReason}</p>
          </td>
        </tr>
      </table>
      <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 28px 0;font-weight:300;">
        You're welcome to address the above and re-apply at any time. We'd be glad to take another look.
      </p>
      ${ctaButton(applyLink, 'Apply Again')}
      <p style="font-size:12px;line-height:1.75;color:#60606b;margin:0 0 28px 0;font-weight:300;">
        If the button does not work, paste this link into your browser:<br>
        <a href="${applyLink}" style="color:#FF7A00;text-decoration:none;word-break:break-all;">${applyLink}</a>
      </p>
    `,
  })
  return sendResendEmail(toEmail, 'Update on your Forke owner application', html, 'owner decline', 'Forke Approvals <approvals@forke.space>')
}

// Shared suspension email used for both owners and developers — identical copy,
// links to the existing /auth-error unban-request form.
async function sendBannedEmail(toEmail: string, name: string, accountKind: 'owner' | 'developer'): Promise<boolean> {
  const baseUrl = resolveBaseUrl()
  const reviewLink = `${baseUrl}/auth-error?error=AccessDenied`
  const html = ownerEmailShell({
    title: 'Forke - Account Suspended',
    heading: 'Account suspended.',
    headingAccent: 'You can request a review.',
    footerLabel: 'ACCOUNT SUSPENSION NOTICE',
    banner: 'user-ban.png',
    bodyHtml: `
      <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">Hello ${name},</p>
      <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 20px 0;font-weight:300;">
        Your Forke ${accountKind} account has been <strong style="color:#ffffff;">suspended</strong> and access has been temporarily restricted. This may be the result of a policy review or activity that requires further verification.
      </p>
      <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 28px 0;font-weight:300;">
        If you believe this was a mistake, you can submit a request for review using the form below and our team will look into it:
      </p>
      ${ctaButton(reviewLink, 'Request a Review')}
      <p style="font-size:12px;line-height:1.75;color:#60606b;margin:0 0 28px 0;font-weight:300;">
        If the button does not work, paste this link into your browser:<br>
        <a href="${reviewLink}" style="color:#FF7A00;text-decoration:none;word-break:break-all;">${reviewLink}</a>
      </p>
    `,
  })
  return sendResendEmail(toEmail, 'Your Forke account has been suspended', html, `${accountKind} ban`, 'Forke Bans <bans@forke.space>')
}

export async function sendOwnerBannedEmail(toEmail: string, name: string): Promise<boolean> {
  return sendBannedEmail(toEmail, name, 'owner')
}

export async function sendDeveloperBannedEmail(toEmail: string, name: string): Promise<boolean> {
  return sendBannedEmail(toEmail, name, 'developer')
}
