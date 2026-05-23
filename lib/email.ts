export async function sendWelcomeEmail(toEmail: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is not configured. Skipping welcome email.')
    return false
  }

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
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            background-color: #050505;
            padding: 40px 10px;
          }
          .card {
            max-width: 500px;
            margin: 0 auto;
            background-color: #0a0a0a;
            border: 1px solid rgba(255, 122, 0, 0.15);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.8);
          }
          .banner-container {
            width: 100%;
            overflow: hidden;
            display: block;
          }
          .banner-img {
            width: 100%;
            height: auto;
            display: block;
          }
          .content {
            padding: 32px 28px;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.04em;
            color: #ffffff;
            margin-bottom: 20px;
          }
          .accent-glow {
            color: #FF7A00;
          }
          h1 {
            font-family: Georgia, serif;
            font-size: 26px;
            font-weight: normal;
            font-style: italic;
            margin: 0 0 16px 0;
            color: #ffffff;
            line-height: 1.25;
          }
          p {
            font-size: 13.5px;
            line-height: 1.6;
            color: #a0a0a0;
            margin: 0 0 20px 0;
            font-weight: 300;
          }
          .tag-container {
            margin: 20px 0 28px 0;
            text-align: center;
          }
          .tag {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 20px;
            padding: 6px 12px;
            margin: 4px;
            font-size: 10px;
            font-weight: bold;
            color: #a0a0a0;
            letter-spacing: 0.02em;
          }
          .tag-check {
            color: #FF7A00;
            margin-right: 4px;
          }
          .btn-container {
            margin: 24px 0 12px 0;
          }
          .btn {
            background: linear-gradient(180deg, #FF7A00 0%, #D97706 100%);
            color: #050505 !important;
            text-decoration: none;
            padding: 13px 30px;
            font-size: 11px;
            font-weight: 900;
            border-radius: 12px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            display: inline-block;
            box-shadow: 0 4px 0 #b45309;
            border-bottom: 2px solid rgba(0,0,0,0.25);
          }
          .divider {
            height: 1px;
            background-color: #1a1a1a;
            margin: 28px 0 20px 0;
          }
          .quote {
            font-family: Georgia, serif;
            font-size: 13px;
            color: #555555;
            margin-bottom: 12px;
            font-style: italic;
          }
          .footer {
            font-size: 9px;
            color: #3f3f3f;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.25em;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="card">
            <div class="banner-container">
              <img src="https://forke.space/forke-assets/banner.png" alt="Forke Banner" class="banner-img" />
            </div>
            <div class="content">
              <div class="logo">
                For<span class="accent-glow">ke</span>
              </div>
              
              <h1>Join the waitlist.<br><span style="color: #FF7A00;">Build the future.</span></h1>
              
              <p>
                Thanks for joining early access. Forke is the premier micro-task marketplace where developers claim bounties, ship real code, and earn rewards.
              </p>
              
              <p>
                We'll email you the exact moment we launch your workspace. In the meantime, prepare your editor. Something big is about to drop.
              </p>
              
              <div class="tag-container">
                <span class="tag"><span class="tag-check">✓</span> Real-world tasks</span>
                <span class="tag"><span class="tag-check">✓</span> Verified contributions</span>
                <span class="tag"><span class="tag-check">✓</span> Fast payouts</span>
              </div>
              
              <div class="btn-container">
                <a href="https://forke.space" class="btn" target="_blank">Visit Workspace</a>
              </div>
              
              <div class="divider"></div>
              
              <div class="quote">
                See you on the other side! ♥
              </div>
              
              <div class="footer">
                © 2026 FORKE &middot; REAL CODE &middot; REAL REWARDS
              </div>
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
