"use client"

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

function classifyLink(target: HTMLElement) {
  const link = target.closest('a') as HTMLAnchorElement | null
  if (!link) return null

  const href = link.getAttribute('href') || ''
  const label = (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)

  if (href.includes('wa.me/')) return { name: 'whatsapp_click', props: { label, href } }
  if (href === '/login' || href.startsWith('/login?')) return { name: 'student_area_click', props: { label, href } }
  if (href.startsWith('/seminars')) return { name: 'seminars_click', props: { label, href } }
  if (href === '#pricing' || href === '/#pricing') return { name: 'pricing_click', props: { label, href } }
  return null
}

export function ConversionTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      const conversion = classifyLink(target)
      if (!conversion) return
      track(conversion.name, conversion.props)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
