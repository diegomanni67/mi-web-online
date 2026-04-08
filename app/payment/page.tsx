"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Shield, Check, AlertCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    acceptTerms: false
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.acceptTerms) {
      alert('Debes aceptar los términos y condiciones')
      return
    }
    
    setIsLoading(true)
    // Simulación de procesamiento de pago
    setTimeout(() => {
      router.push('/success')
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-[oklch(0.72_0.19_220/0.12)] blur-[120px]" />
        <div className="absolute -right-32 top-1/3 size-[400px] rounded-full bg-[oklch(0.72_0.22_350/0.1)] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 size-[450px] rounded-full bg-[oklch(0.75_0.18_55/0.08)] blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver
          </button>

          <div className="rounded-3xl glass border border-border/50 p-8 shadow-[0_8px_40px_oklch(0_0_0/0.08)]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)]">
                <CreditCard className="size-8 text-[oklch(0.99_0_0)]" />
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground mb-2">
                Completa tu pago
              </h1>
              <p className="text-lg text-muted-foreground">
                Acceso completo a Koterie Language Studio
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Payment Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Información de la tarjeta</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                        className="w-full rounded-2xl border border-border/50 bg-background px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nombre en la tarjeta
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cardName}
                        onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                        className="w-full rounded-2xl border border-border/50 bg-background px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="JUAN PÉREZ"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Vencimiento
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({...formData, expiryDate: formatExpiryDate(e.target.value)})}
                          className="w-full rounded-2xl border border-border/50 bg-background px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="MM/AA"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cvv}
                          onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                          className="w-full rounded-2xl border border-border/50 bg-background px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email para el recibo
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded-2xl border border-border/50 bg-background px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="tu@email.com"
                    />
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                      className="mt-1 size-4 rounded border-border/50 bg-background text-primary focus:ring-primary/20"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      Acepto los <button type="button" className="text-primary hover:underline">términos y condiciones</button> y la <button type="button" className="text-primary hover:underline">política de privacidad</button>. Entiendo que la suscripción es recurrente y puedo cancelarla en cualquier momento.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !formData.acceptTerms}
                    className={cn(
                      "w-full rounded-2xl px-6 py-4 text-lg font-bold transition-all duration-500",
                      "bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)]",
                      "text-[oklch(0.99_0_0)] shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)]",
                      "hover:shadow-[0_8px_30px_oklch(0.72_0.19_220/0.4)] hover:scale-[1.02]",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    )}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="size-5 animate-spin rounded-full border-2 border-[oklch(0.99_0_0)] border-t-transparent" />
                        Procesando pago...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Pagar USD 80/mes
                        <ArrowRight className="size-5" />
                      </div>
                    )}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-border/50 bg-secondary/20 p-6">
                  <h3 className="font-semibold text-foreground mb-4">Resumen del pedido</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Koterie Language Studio</span>
                      <span className="text-sm font-medium">Mensual</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Acceso completo</span>
                      <span className="text-sm font-medium">✓</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Seminarios exclusivos</span>
                      <span className="text-sm font-medium">✓</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Certificados</span>
                      <span className="text-sm font-medium">✓</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-foreground">Total</span>
                      <span className="text-2xl font-black bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] bg-clip-text text-transparent">
                        USD 80
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Renovación automática mensual
                    </p>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 rounded-xl bg-primary/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="size-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Pago seguro</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tu información está encriptada y protegida. No almacenamos tus datos de tarjeta.
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="size-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">Cancela cuando quieras</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">Garantía de 7 días</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">Soporte 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
