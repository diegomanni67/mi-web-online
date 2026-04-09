"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CreditCard, Crown, Lock, CheckCircle } from 'lucide-react'

export default function UpgradePage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  // VERSIÓN LOCAL ABIERTA - ACCESO DIRECTO
  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Procesando...</div>
      </div>
    )
  }

  // VERSIÓN LOCAL ABIERTA - ACCESO DIRECTO
  if (true) { // Siempre mostrar contenido en versión local
    // Redirigir a página de éxito
    router.push('/upgrade/success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Desbloquea Koterie Premium
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Acceso completo a foros, clases en vivo y contenido exclusivo
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Gratis</h3>
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-600">/mes</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Perfil básico</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Directorio de alumnos</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-400">Foros privados</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-400">Clases en vivo</span>
                </li>
              </ul>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Premium</h3>
                <Crown className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="text-3xl font-bold mb-6">$19<span className="text-lg opacity-90">/mes</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Todo lo gratis +</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Foros Academy & Studio</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Clases en vivo ilimitadas</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Contenido exclusivo</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Button - VERSIÓN LOCAL ABIERTA */}
          <div className="text-center">
            <button
              onClick={() => router.push('/upgrade/success')}
              disabled={isProcessing}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Acceder Gratuitamente
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-600 mt-4">
              Pago seguro con encriptación SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
