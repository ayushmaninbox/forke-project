import type { Metadata } from 'next'
import { geistSans, instrumentSerif, jetbrainsMono } from '@/app/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Forke — ship real work, get paid',
  description: 'The micro-task marketplace for developers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
