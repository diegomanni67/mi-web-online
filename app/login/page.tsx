"use client"

// VERSIÓN LOCAL ABIERTA - LOGIN DESACTIVADO

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Mail, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [credentialsError, setCredentialsError] = useState('')

  // VERSIÓN LOCAL ABIERTA - REDIRIGIR DIRECTAMENTE
  useEffect(() => {
    router.push('/')
  }, [router])

  // Limpiar cookies si hay error de sesión
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    
    if (error) {
      // Limpiar cookies de sesión
      document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      })
      console.log('Session error detected, cookies cleared')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // VERSIÓN LOCAL ABIERTA - REDIRIGIR DIRECTAMENTE
    router.push('/')
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <img 
            src="/koterie-logo-transparent.png" 
            alt="Koterie Language Studio" 
            className="w-24 h-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Koterie Language Studio
          </h1>
          <p className="text-gray-600">
            Tu club social premium de idiomas
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bienvenido de vuelta
            </h2>
            <p className="text-sm text-gray-600">
              Ingresa para acceder a tu perfil y comunidad
            </p>
          </div>

          
          {/* Credentials Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent pr-12"
                  placeholder="tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {credentialsError && (
              <div className="text-red-600 text-sm text-center">
                {credentialsError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-medium">
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </span>
              {isLoading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </form>

          {/* Botón adicional de inicio de sesión - funciona independientemente */}
          <div className="mt-4">
            <button
              onClick={() => router.push('/')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-medium">
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión (Alternativo)'}
              </span>
              {isLoading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </div>

          {/* Demo Accounts Info */}
          <div className="mt-6 p-4 bg-purple-50 rounded-xl">
            <p className="text-xs text-purple-700 font-medium mb-2">Cuentas de demo:</p>
            <div className="text-xs text-purple-600 space-y-1">
              <p>Admin: admin@koterie.com / admin123</p>
              <p>Usuario: user@koterie.com / user123</p>
              <p>Pagado: paid@koterie.com / paid123</p>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Al continuar, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Nuevo en Koterie?{' '}
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
