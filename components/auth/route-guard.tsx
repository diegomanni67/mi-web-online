"use client"

// ROUTE GUARD DESACTIVADO - VERSIÓN LOCAL ABIERTA
// Esta versión permite acceso público a todo el contenido

interface RouteGuardProps {
  children: React.ReactNode
  requiredForum?: 'academy' | 'studio'
  fallback?: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  // VERSIÓN LOCAL ABIERTA - SIN RESTRICCIONES DE ACCESO
  return <>{children}</>
}
