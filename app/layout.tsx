import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/Providers'
import { Header } from '@/components/Header'
import { ConversionTracking } from '@/components/ConversionTracking'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

const siteUrl = 'https://mi-web-online.vercel.app'
const siteTitle = 'Koterie Language Studio | Clases de inglés + comunidad'
const siteDescription = 'Clases de inglés en vivo, práctica entre clases, comunidad, actividades y herramientas digitales en una misma plataforma.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Koterie Language Studio',
  title: {
    default: siteTitle,
    template: '%s | Koterie Language Studio',
  },
  description: siteDescription,
  category: 'education',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    siteName: 'Koterie Language Studio',
    title: siteTitle,
    description: siteDescription,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Koterie Language Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = { themeColor: '#0a0f1e', userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>
          <Header />
          <ConversionTracking />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
