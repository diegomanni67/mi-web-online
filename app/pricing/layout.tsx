import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clases de inglés y modalidades',
  description: 'Conocé las modalidades de clases de inglés de Koterie: clases grupales e individuales con acceso a la plataforma y práctica entre clases.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    url: '/pricing',
    title: 'Clases de inglés y modalidades | Koterie Language Studio',
    description: 'Clases grupales e individuales con práctica y comunidad entre clases.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Clases de inglés Koterie Language Studio' }],
  },
}

export default function PricingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
