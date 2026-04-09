"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Zap, Shield, Star, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const benefits = [
  "Acceso completo a Academy o Studio",
  "Seminarios exclusivos mensuales",
  "Clase en vivo de 2 horas semanal", 
  "Material de estudio descargable",
  "Docentes especializados",
  "Soporte personalizado 24/7"
]

export function PricingSection() {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleMercadoPagoPayment = async () => {
    setIsLoading(true)
    try {
      // Datos del producto
      const items = [
        {
          id: 'koterie-membership',
          title: 'Membresía Koterie',
          unit_price: 100000, // $100.000 ARS
          quantity: 1,
        },
      ]

      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invitado@koterie.local'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirigir a Mercado Pago
        window.location.href = data.init_point
      } else {
        console.error('Error creating payment preference:', data.error)
        alert('Error al procesar el pago. Por favor intenta nuevamente.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Error al procesar el pago. Por favor intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[oklch(0.72_0.19_220/0.03)] via-[oklch(0.72_0.22_350/0.03)] to-[oklch(0.75_0.18_55/0.03)]" />
        <div className="absolute -left-20 -top-20 size-60 rounded-full bg-[oklch(0.72_0.19_220/0.08)] blur-3xl animate-pulse" />
        <div className="absolute -right-20 -bottom-20 size-60 rounded-full bg-[oklch(0.72_0.22_350/0.08)] blur-3xl animate-pulse" />
      </div>

      <div className="rounded-3xl glass border border-border/50 p-8 sm:p-10 lg:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] p-3 shadow-[0_8px_30px_oklch(0.72_0.19_220/0.4)]">
                <CreditCard className="size-6 text-[oklch(0.99_0_0)]" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-[oklch(0.72_0.19_220/0.2)] blur-xl animate-pulse" />
            </div>
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-tight text-black mb-3 sm:text-4xl">
            Acceso Completo
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Todo el contenido de Koterie Language Studio en un solo plan
          </p>
        </div>

        {/* Price Display */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Background glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[oklch(0.72_0.19_220/0.2)] via-[oklch(0.72_0.22_350/0.2)] to-[oklch(0.75_0.18_55/0.2)] blur-2xl scale-110 animate-pulse" />
            
            <div className="relative rounded-3xl bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] p-1">
              <div className="rounded-3xl bg-background p-6 sm:p-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl sm:text-5xl font-bold text-black">USD</span>
                  <span className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] bg-clip-text text-transparent">
                    80
                  </span>
                  <span className="text-xl sm:text-2xl font-semibold text-gray-700">/ mes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-8">
          <button
            className={cn(
              "group relative overflow-hidden rounded-2xl px-8 py-4 text-lg font-bold transition-all duration-500",
              "bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)]",
              "text-[oklch(0.99_0_0)] shadow-[0_8px_30px_oklch(0.72_0.19_220/0.4)]",
              "hover:shadow-[0_12px_40px_oklch(0.72_0.19_220/0.5)] hover:scale-[1.02]",
              "active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleMercadoPagoPayment}
            disabled={isLoading}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[oklch(1_0_0/0.3)] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            
            <div className="relative flex items-center gap-3">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Zap className="size-5" />
                  <span>Inscribirse y Pagar</span>
                  <ArrowRight className={cn(
                    "size-5 transition-transform duration-300",
                    isHovered && "translate-x-1"
                  )} />
                </>
              )}
            </div>
          </button>
        </div>

        {/* Benefits */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl glass px-4 py-3 border border-border/50"
            >
              <div className="flex items-center justify-center rounded-xl bg-primary/10 p-2">
                <Check className="size-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-800">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Footer trust message */}
        <div className="text-center mt-8 pt-6 border-t border-border/50">
          <p className="text-xs text-gray-700">
            Cancela cuando quieras • Sin costos ocultos • Soporte en español
          </p>
        </div>
      </div>
    </div>
  )
}
