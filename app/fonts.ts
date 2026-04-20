import { Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'

export const geistSans = GeistSans

export const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})
