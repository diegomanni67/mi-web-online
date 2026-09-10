import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seminarios de inglés',
  description: 'Seminarios especiales de Koterie, completamente en inglés, para practicar conversación, ideas y temas de interés en niveles avanzados.',
  alternates: { canonical: '/seminars' },
  openGraph: {
    url: '/seminars',
    title: 'Seminarios de inglés | Koterie Language Studio',
    description: 'Encuentros especiales de Koterie, completamente en inglés, para niveles avanzados.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Seminarios Koterie Language Studio' }],
  },
}

export default function SeminarsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
