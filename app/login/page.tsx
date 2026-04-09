"use client"

import { signIn, useSession } from 'next-auth/react'
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
  const { data: session, status } = useSession()

  // Debug de sesión
  useEffect(() => {
    console.log('Session Debug:', { status, session })
    
    // Si está autenticado, redirigir al checkout para que pague
    if (status === 'authenticated') {
      console.log('User authenticated, redirecting to /checkout')
      router.push('/checkout')
    }
  }, [status, session, router])

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

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // Debug: Verificar que la URL es correcta
      console.log('Current URL:', window.location.origin)
      console.log('Attempting Google sign in...')
      
      await signIn('google')
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setCredentialsError('')
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      
      if (result?.error) {
        setCredentialsError('Credenciales inválidas')
      } else if (result?.ok) {
        router.push('/checkout')
      }
    } catch (error) {
      setCredentialsError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
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

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              {isLoading ? 'Conectando...' : 'Continuar con Google'}
            </span>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">o</span>
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
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
