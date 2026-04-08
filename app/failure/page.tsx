"use client"

import { useRouter } from "next/navigation"
import { XCircle, ArrowRight, RefreshCw } from "lucide-react"

export default function FailurePage() {
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
          {/* Failure Icon */}
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-[0_8px_30px_rgba(239,68,68,0.4)]">
            <XCircle className="size-10 text-white" />
          </div>

          {/* Main Content */}
          <div className="rounded-3xl glass border border-border/50 p-8 shadow-[0_8px_40px_oklch(0_0_0/0.08)]">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground mb-4">
              Pago No Completado
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Tu pago no pudo ser procesado. Por favor intenta nuevamente o contacta a soporte.
            </p>

            {/* Possible Reasons */}
            <div className="bg-red-50/50 border border-red-200/50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-red-800 mb-3">Posibles razones:</h3>
              <ul className="text-sm text-red-700 space-y-2 text-left">
                <li> Fondos insuficientes en la tarjeta</li>
                <li> Tarjeta rechazada por el banco</li>
                <li> Error de conexión durante el proceso</li>
                <li> Datos de pago incorrectos</li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push('/checkout')}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(239,68,68,0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(239,68,68,0.4)] hover:scale-[1.02]"
              >
                <RefreshCw className="size-4" />
                Intentar Nuevamente
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-background px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-[oklch(0.72_0.19_220/0.5)] hover:bg-[oklch(0.72_0.19_220/0.05)] hover:shadow-[0_4px_20px_oklch(0.72_0.19_220/0.1)] hover:scale-[1.02]"
              >
                <ArrowRight className="size-4" />
                Volver al Inicio
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Si el problema persiste, contacta a{" "}
                <button className="text-primary hover:underline">soporte@koterie.com</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
