export async function sendWelcomeEmail(toEmail: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is not configured. Skipping welcome email.')
    return false
  }

  // Fallback to Resend sandbox sender if no custom verified sender is configured
  const fromEmail = process.env.WAITLIST_EMAIL_FROM || 'Forke <onboarding@resend.dev>'

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Forke</title>
        <style>
          body {
            background-color: #050505;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            background-color: #050505;
            padding: 40px 20px;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #0c0c0c;
            border: 1px solid #1a1a1a;
            border-radius: 24px;
            padding: 40px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.04em;
            color: #ffffff;
            margin-bottom: 24px;
          }
          .accent-glow {
            color: #FF7A00;
            text-shadow: 0 0 20px rgba(255, 122, 0, 0.2);
          }
          h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 16px 0;
            color: #ffffff;
            letter-spacing: -0.02em;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
            color: #888888;
            margin: 0 0 24px 0;
            font-weight: 300;
          }
          .btn-container {
            margin-bottom: 32px;
          }
          .btn {
            background: linear-gradient(180deg, #FF7A00 0%, #E66E00 100%);
            color: #050505 !important;
            text-decoration: none;
            padding: 14px 32px;
            font-size: 12px;
            font-weight: 700;
            border-radius: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(255, 122, 0, 0.2);
          }
          .divider {
            height: 1px;
            background-color: #1a1a1a;
            margin: 32px 0 20px 0;
          }
          .footer {
            font-size: 10px;
            color: #444444;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="logo">
              For<span class="accent-glow">ke</span>
            </div>
            <h1>You're on the list, developer.</h1>
            <p>
              Thanks for joining early access. Forke is the premier micro-task marketplace where you claim bounties, ship real code, and earn rewards.
            </p>
            <p>
              We'll email you the exact moment we go live. In the meantime, prepare your editor. Something big is about to drop.
            </p>
            <div class="btn-container">
              <a href="https://forke.space" class="btn" target="_blank">Visit Forke</a>
            </div>
            <div class="divider"></div>
            <div class="footer">
              © 2026 FORKE &middot; REAL CODE &middot; REAL REWARDS
            </div>
          </div>
        </div>
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
