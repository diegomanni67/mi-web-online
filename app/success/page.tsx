"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, ArrowRight, Sparkles, Download, Calendar, Users } from "lucide-react"

export default function SuccessPage() {
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
          {/* Success Icon */}
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] shadow-[0_8px_30px_oklch(0.72_0.19_220/0.4)]">
            <CheckCircle className="size-10 text-[oklch(0.99_0_0)]" />
          </div>

          {/* Main Content */}
          <div className="rounded-3xl glass border border-border/50 p-8 shadow-[0_8px_40px_oklch(0_0_0/0.08)]">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground mb-4">
              ¡Bienvenido a la Koterie!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Tu pago fue procesado con éxito. Ya tienes acceso completo a nuestra plataforma.
            </p>

            {/* Next Steps */}
            <div className="grid gap-4 mb-8 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Entrevista de Nivelación</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Tu próximo paso es una entrevista virtual con un profesor para asignarte tu rango.
                </p>
                <div className="text-xs text-primary font-medium">
                  Te contactaremos pronto para agendar tu sesión
                </div>
              </div>
              <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-accent/10">
                  <Users className="size-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Acceso a Foros</h3>
                <p className="text-sm text-muted-foreground">
                  Después de la entrevista, obtendrás acceso a Academy y/o Studio
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)]">
                  <Download className="size-6 text-[oklch(0.99_0_0)]" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Material de estudio</h3>
                <p className="text-sm text-muted-foreground">Descarga recursos para comenzar</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] px-6 py-3 text-sm font-bold text-[oklch(0.99_0_0)] shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_oklch(0.72_0.19_220/0.4)] hover:scale-[1.02]"
              >
                <Sparkles className="size-4" />
                Volver al Inicio
              </button>
              
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-background px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-[oklch(0.72_0.19_220/0.5)] hover:bg-[oklch(0.72_0.19_220/0.05)] hover:shadow-[0_4px_20px_oklch(0.72_0.19_220/0.1)] hover:scale-[1.02]"
              >
                <Users className="size-4" />
                Ir a mi Perfil
              </button>
              
              <button
                className="flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-background px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-[oklch(0.72_0.19_220/0.5)] hover:bg-[oklch(0.72_0.19_220/0.05)]"
              >
                Ver mi perfil
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Receipt Info */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Hemos enviado un recibo a tu email. Para cualquier consulta, contacta a{" "}
                <button className="text-primary hover:underline">soporte@koterie.com</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
