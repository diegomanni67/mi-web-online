"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RegistroSimplePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()


  if (isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-[oklch(0.72_0.19_220/0.12)] blur-[120px]" />
          <div className="absolute -right-32 top-1/3 size-[400px] rounded-full bg-[oklch(0.72_0.22_350/0.1)] blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 size-[450px] rounded-full bg-[oklch(0.75_0.18_55/0.08)] blur-[120px]" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg">
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Volver
            </button>

            <div className="rounded-3xl glass border border-border/50 p-8 shadow-[0_8px_40px_oklch(0_0_0/0.08)]">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)]">
                  <Sparkles className="size-8 text-[oklch(0.99_0_0)]" />
                </div>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground mb-2">
                  ¡Listo para pagar!
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Elegí tu método de pago preferido
                </p>
                <div className="text-4xl font-black bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] bg-clip-text text-transparent mb-8">
                  USD 80 / mes
                </div>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => window.open('#', '_blank')}
                  className={cn(
                    "w-full rounded-2xl px-6 py-6 text-lg font-bold transition-all duration-500",
                    "bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)]",
                    "text-[oklch(0.99_0_0)] shadow-[0_8px_30px_oklch(0.72_0.19_220/0.3)]",
                    "hover:shadow-[0_12px_40px_oklch(0.72_0.19_220/0.4)] hover:scale-[1.02]"
                  )}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="size-6 rounded-xl bg-[oklch(0.99_0_0)] p-1">
                      <div className="size-4 rounded bg-gradient-to-br from-[#00AEEF] via-[#0066CC] to-[#004499]" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Pagar con Mercado Pago</div>
                      <div className="text-sm text-[oklch(0.99_0_0/0.8)]">Tarjetas, efectivo y más</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => window.open('#', '_blank')}
                  className={cn(
                    "w-full rounded-2xl px-6 py-6 text-lg font-bold transition-all duration-500",
                    "bg-gradient-to-r from-[oklch(0.72_0.22_350)] via-[oklch(0.75_0.18_55)] to-[oklch(0.72_0.19_220)]",
                    "text-[oklch(0.99_0_0)] shadow-[0_8px_30px_oklch(0.72_0.22_350/0.3)]",
                    "hover:shadow-[0_12px_40px_oklch(0.72_0.22_350/0.4)] hover:scale-[1.02]"
                  )}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="size-6 rounded-xl bg-[oklch(0.99_0_0)] p-1">
                      <div className="size-4 rounded bg-gradient-to-br from-[#635BFF] via-[#6366F1] to-[#4F46E5]" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Pagar con Stripe</div>
                      <div className="text-sm text-[oklch(0.99_0_0/0.8)]">Tarjetas de crédito y débito</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Seguro y protegido</span> • Todos los pagos son procesados de forma segura
                </p>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-[oklch(0.72_0.19_220/0.12)] blur-[120px]" />
        <div className="absolute -right-32 top-1/3 size-[400px] rounded-full bg-[oklch(0.72_0.22_350/0.1)] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 size-[450px] rounded-full bg-[oklch(0.75_0.18_55/0.08)] blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver
          </button>

          <div className="rounded-3xl glass border border-border/50 p-8 shadow-[0_8px_40px_oklch(0_0_0/0.08)]">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)]">
                <Sparkles className="size-8 text-[oklch(0.99_0_0)]" />
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground mb-2">
                Regístrate en Koterie
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Acceso completo por solo
              </p>
              <div className="text-4xl font-black bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] bg-clip-text text-transparent">
                USD 80 / mes
              </div>
            </div>


            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <button 
                  onClick={() => router.push('/auth')}
                  className="font-medium text-primary hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
