import type { MetadataRoute } from 'next'

const siteUrl = 'https://mi-web-online.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/seminars', '/pricing'],
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/academy-forum/',
          '/studio-forum/',
          '/practice/',
          '/community/',
          '/profile/',
          '/login',
          '/auth/',
          '/registro',
          '/registro-simple',
          '/checkout',
          '/payment',
          '/pending',
          '/success',
          '/failure',
          '/upgrade',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
