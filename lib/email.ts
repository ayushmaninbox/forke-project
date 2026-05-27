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
                    <img src="https://forke.space/forke-assets/banner.png" alt="Forke Banner" width="580" style="width:100%;max-width:580px;height:auto;display:block;border-bottom:1px solid rgba(255,122,0,0.05);" />
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
        from: fromEmail,
        to: toEmail,
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
          from: fromEmail,
          to: email,
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
                    <img src="https://forke.space/forke-assets/banner.png" alt="Forke Banner" width="580" style="width:100%;max-width:580px;height:auto;display:block;border-bottom:1px solid rgba(255,122,0,0.05);" />
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
        from: fromEmail,
        to: toEmail,
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
