import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-[75vh] bg-[#0a0f1e] px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-8 text-center sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">404 · Koterie</p>
        <h1 className="mt-4 text-3xl font-bold">Esta página no existe.</h1>
        <p className="mt-3 text-sm leading-6 text-white/45">Puede ser una dirección antigua de Koterie o un enlace incompleto.</p>
        <Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold hover:bg-purple-500"><ArrowLeft className="h-4 w-4" /> Volver al inicio</Link>
      </div>
    </main>
  )
}
