"use client"

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Koterie page error', error) }, [error])
  return (
    <main className="min-h-[75vh] bg-[#0a0f1e] px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-red-500/15 bg-red-500/[0.045] p-7 text-center sm:p-9">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-xl">!</div>
        <h1 className="mt-5 text-2xl font-bold">Esta pantalla no pudo cargarse.</h1>
        <p className="mt-3 text-sm leading-6 text-white/45">No se perdió ningún dato. Podés intentar nuevamente o volver a tu área de Koterie.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={reset} className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950">Intentar de nuevo</button>
          <Link href="/dashboard" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold">Ir a Mi Koterie</Link>
        </div>
      </div>
    </main>
  )
}
