"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRank } from '@/lib/user-ranks'
import { AlertCircle, Lock, ArrowLeft } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
  requiredForum: 'academy' | 'studio'
  fallback?: React.ReactNode
}

export function RouteGuard({ children, requiredForum, fallback }: RouteGuardProps) {
  const { user, loading, hasAccess } = useUserRank()
  const router = useRouter()
  const [showRestricted, setShowRestricted] = useState(false)

  useEffect(() => {
    // Temporalmente desactivado para permitir acceso al foro
    // if (!loading) {
    //   if (!user) {
    //     // Si no hay usuario, redirigir a login
    //     router.push('/auth')
    //   } else if (!hasAccess(requiredForum)) {
    //     // Si no tiene acceso, mostrar mensaje de restricción
    //     setShowRestricted(true)
    //   }
    // }
  }, [user, loading, hasAccess, requiredForum, router])

  // Mientras carga, mostrar spinner
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-[oklch(0.72_0.19_220/0.12)] blur-[120px]" />
          <div className="absolute -right-32 top-1/3 size-[400px] rounded-full bg-[oklch(0.72_0.22_350/0.1)] blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 size-[450px] rounded-full bg-[oklch(0.75_0.18_55/0.08)] blur-[120px]" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Verificando acceso...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    return null // El useEffect se encargará de la redirección
  }

  // Si no tiene acceso, mostrar mensaje de restricción
  if (showRestricted || !hasAccess(requiredForum)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-[oklch(0.72_0.19_220/0.12)] blur-[120px]" />
          <div className="absolute -right-32 top-1/3 size-[400px] rounded-full bg-[oklch(0.72_0.22_350/0.1)] blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 size-[450px] rounded-full bg-[oklch(0.75_0.18_55/0.08)] blur-[120px]" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Volver
            </button>

            <div className="rounded-3xl glass border border-border/50 p-8 shadow-[0_8px_40px_oklch(0_0_0/0.08)]">
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
                  <Lock className="size-8 text-red-500" />
                </div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground mb-2">
                  Acceso Restringido
                </h1>
                <p className="text-sm text-muted-foreground">
                  No tienes permiso para acceder a este foro
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Requisitos de acceso
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {requiredForum === 'academy' 
                        ? 'Para acceder al foro Academy necesitas tener el rol "Academy" asignado por un profesor después del nivelatorio.'
                        : 'Para acceder al foro Studio necesitas tener el rol "Studio" asignado por un profesor después del nivelatorio.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/')}
                  className="w-full rounded-2xl bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] px-6 py-3 text-sm font-bold text-[oklch(0.99_0_0)] shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_oklch(0.72_0.19_220/0.4)] hover:scale-[1.02]"
                >
                  Ir al inicio
                </button>
                
                <button
                  onClick={() => router.push('/auth')}
                  className="w-full rounded-2xl border border-border/50 bg-background px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-[oklch(0.72_0.19_220/0.5)] hover:bg-[oklch(0.72_0.19_220/0.05)]"
                >
                  Cambiar de cuenta
                </button>
              </div>

              {/* Información del usuario actual */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Sesión actual: <span className="font-medium text-foreground">{user.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rol: <span className="font-medium text-foreground">{user.role === 'none' ? 'Sin acceso' : user.role}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nivel: <span className="font-medium text-foreground">{user.level}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si tiene acceso, mostrar el contenido
  return <>{children}</>
}
