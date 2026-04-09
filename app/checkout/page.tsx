"use client"

// MERCADO PAGO ELIMINADO - VERSIÓN LOCAL ABIERTA
// Esta versión es completamente gratuita y sin dependencias de pago

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CheckoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Checkout page es ahora GRATUITA - sin pago requerido
  }, [])

  const handleFreeAccess = async () => {
    setIsLoading(true)
    try {
      // Acceso gratuito directo - sin procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación mínima
      router.push('/') // Redirigir al inicio con acceso completo
    } catch (error) {
      console.error('Access error:', error)
      alert('Error al obtener acceso. Por favor intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show checkout page - PUBLIC PAGE - ACCESO GRATUITO

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            </div>
            <div className="text-sm text-gray-500">Koterie Membership</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Acceso Gratuito</h2>
            <p className="text-lg opacity-90 mb-6">
              ¡Bienvenido! Esta es una versión local abierta. Tienes acceso completo a toda la comunidad Koterie y todos nuestros foros sin costo alguno.
            </p>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Estado</p>
                  <p className="text-4xl font-bold">GRATIS</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Acceso completo a:</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li> Academy Forum</li>
                    <li> Studio Forum</li>
                    <li> Perfil y comunidad</li>
                    <li> Todos los recursos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">¿Qué incluye tu acceso gratuito?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Foros Exclusivos</h4>
                  <p className="text-sm text-gray-600">Acceso completo a Academy o Studio forums con contenido premium.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Comunidad Activa</h4>
                  <p className="text-sm text-gray-600">Conecta con otros estudiantes y profesores en la comunidad Koterie.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Recursos Premium</h4>
                  <p className="text-sm text-gray-600">Material de estudio exclusivo y ejercicios personalizados.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Soporte Directo</h4>
                  <p className="text-sm text-gray-600">Chat directo con profesores y soporte prioritario.</p>
                </div>
              </div>
            </div>

            {/* Access Button */}
            <div className="border-t border-gray-200 pt-8">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-800">Acceso Gratuito</p>
                    <p className="text-sm text-green-700">Esta es una versión de prueba local. Disfruta de todo el contenido sin costo.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFreeAccess}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Activando acceso...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Obtener Acceso Gratuito Ahora
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Acceso instantáneo a toda la plataforma. Sin costos ni suscripciones.
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 text-center">
          <>
            <p className="text-sm text-gray-600 mb-2">
              Acceso sin registro. Disfruta de toda la plataforma gratis.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Volver al inicio
            </button>
          </>
        </div>
      </div>
    </div>
  )
}
