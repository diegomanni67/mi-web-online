"use client"

import { useEffect, useState } from 'react'

export type Member = { id: string; name: string; email: string; access: 'academy' | 'studio'; role: 'student' | 'teacher' | 'admin' }

export function useMember() {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    fetch('/api/member/me', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => active && setMember(data.member || null))
      .catch(() => active && setMember(null))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])
  return { member, loading }
}
