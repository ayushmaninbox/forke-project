'use client'

import { useCookieConsent } from './CookieConsentProvider'
import { GoogleAnalytics } from '@next/third-parties/google'

export function GoogleAnalyticsWrapper({ gaId }: { gaId?: string }) {
  const { consent } = useCookieConsent()

  if (!gaId || consent !== 'accepted') {
    return null
  }

  return <GoogleAnalytics gaId={gaId} />
}
