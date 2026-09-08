import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { PricingSection } from '@/components/dashboard/pricing-section'

const whatsapp = 'https://wa.me/5491162991211?text=Hola%20Ana%20Laura%2C%20vi%20Koterie%20y%20quiero%20consultar%20por%20las%20clases%20de%20ingl%C3%A9s.'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to Koterie</Link>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold transition hover:bg-white/10"><MessageCircle className="h-4 w-4" /> Ask Ana Laura</a>
        </div>
        <div className="mt-10 rounded-[2rem] border border-white/[0.07] bg-white/[0.018] px-4 py-12 sm:px-8 lg:px-12">
          <PricingSection />
        </div>
      </div>
    </main>
  )
}
