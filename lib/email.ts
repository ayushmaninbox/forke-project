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
                    <!-- Brand Title (Forke - Georgia Serif font) -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 24px auto;">
                      <tr>
                        <td style="font-family:Georgia,serif;font-size:32px;font-weight:normal;letter-spacing:-0.02em;color:#ffffff;">
                          Forke
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
                    <p style="font-size:14px;line-height:1.75;color:#a0a0ab;margin:0 0 28px 0;font-weight:300;">
                      We&apos;ll email you the exact moment we launch your workspace. In the meantime, prepare your editor. Something big is about to drop.
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
                    
                    <!-- CTA Button -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 40px auto;">
                      <tr>
                        <td align="center" style="background:linear-gradient(180deg,#FF7A00 0%,#D97706 100%);border-radius:12px;box-shadow:0 4px 0 #b45309;">
                          <a href="https://forke.space" target="_blank" style="display:inline-block;padding:16px 36px;font-size:11px;font-weight:900;color:#050505;text-decoration:none;text-transform:uppercase;letter-spacing:0.15em;border-radius:12px;border-bottom:2px solid rgba(0,0,0,0.25);">
                            Visit Workspace
                          </a>
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
