import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <main className="min-h-[70vh] bg-[#0a0f1e] px-4 py-20 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-[2rem] border border-white/[0.07] bg-white/[0.025] px-6 py-16 text-center">
        <Loader2 className="h-7 w-7 animate-spin text-purple-300" />
        <p className="mt-4 text-sm font-semibold text-white/55">Cargando Koterie…</p>
      </div>
    </main>
  )
}
