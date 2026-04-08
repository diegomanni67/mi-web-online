"use client"

import { useRouter } from "next/navigation"
import { Clock, ArrowRight, RefreshCw } from "lucide-react"

export default function PendingPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-[oklch(0.72_0.19_220/0.12)] blur-[120px]" />
        <div className="absolute -right-32 top-1/3 size-[400px] rounded-full bg-[oklch(0.72_0.22_350/0.1)] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 size-[450px] rounded-full bg-[oklch(0.75_0.18_55/0.08)] blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl text-center">
          {/* Pending Icon */}
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 shadow-[0_8px_30px_rgba(245,158,11,0.4)]">
            <Clock className="size-10 text-white" />
          </div>

          {/* Main Content */}
          <div className="rounded-3xl glass border border-border/50 p-8 shadow-[0_8px_40px_oklch(0_0_0/0.08)]">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground mb-4">
              Pago en Proceso
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Tu pago está siendo procesado. Te notificaremos cuando se complete.
            </p>

            {/* Processing Info */}
            <div className="bg-yellow-50/50 border border-yellow-200/50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-yellow-800 mb-3">¿Qué sucede ahora?</h3>
              <ul className="text-sm text-yellow-700 space-y-2 text-left">
                <li> Tu pago está siendo verificado por Mercado Pago</li>
                <li> Recibirás un email cuando se complete el proceso</li>
                <li> El acceso a los foros se activará automáticamente</li>
                <li> Este proceso puede tardar unos minutos</li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] px-6 py-3 text-sm font-bold text-[oklch(0.99_0_0)] shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_oklch(0.72_0.19_220/0.4)] hover:scale-[1.02]"
              >
                <ArrowRight className="size-4" />
                Volver al Inicio
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-background px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-[oklch(0.72_0.19_220/0.5)] hover:bg-[oklch(0.72_0.19_220/0.05)] hover:shadow-[0_4px_20px_oklch(0.72_0.19_220/0.1)] hover:scale-[1.02]"
              >
                <RefreshCw className="size-4" />
                Verificar Estado
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Si tienes dudas sobre el estado de tu pago, contacta a{" "}
                <button className="text-primary hover:underline">soporte@koterie.com</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
