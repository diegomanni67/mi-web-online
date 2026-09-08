"use client"

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, KeyRound, LogIn, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/member/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, code }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not sign in')
      const next = params.get('next')
      router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#070b15] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Volver a Koterie</Link>
        <div className="mt-7 rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-5 shadow-2xl shadow-black/30 sm:mt-10 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600"><Sparkles className="h-6 w-6" /></div>
          <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Acceso a Koterie</h1>
          <p className="mt-3 text-sm leading-6 text-white/45">Ingresá con el email que tu profesora cargó y el código de acceso correspondiente. Tu nombre solo se pide si alguna vez habilitamos inscripción abierta. Tu email permanece privado.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div><label className="mb-2 block text-sm font-medium text-white/65">Nombre <span className="text-white/30">(solo si te lo pide Koterie)</span></label><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={60} className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 outline-none focus:border-purple-400/35" /></div>
            <div><label className="mb-2 block text-sm font-medium text-white/65">Email</label><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 outline-none focus:border-purple-400/35" /></div>
            <div><label className="mb-2 block text-sm font-medium text-white/65">Código de acceso</label><div className="flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-3 focus-within:border-purple-400/35"><KeyRound className="h-4 w-4 text-white/30" /><input value={code} onChange={(event) => setCode(event.target.value)} type="password" autoComplete="current-password" required className="w-full bg-transparent px-3 py-3 outline-none" /></div></div>
            {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
            <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3.5 font-bold transition hover:brightness-110 disabled:opacity-50"><LogIn className="h-4 w-4" /> {loading ? 'Ingresando…' : 'Entrar a Koterie'}</button>
          </form>
        </div>
      </div>
    </main>
  )
}
