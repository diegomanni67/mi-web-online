"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle, Crown, ArrowRight } from 'lucide-react'

export default function UpgradeSuccessPage() {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // VERSIÓN LOCAL ABIERTA - REDIRIGIR DESPUÉS DE SIMULACIÓN
    const simulateUpgrade = async () => {
      setIsUpdating(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsUpdating(false)
    }

    simulateUpgrade()
  }, [])

  const handleGoToForums = () => {
    router.push('/foros')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (isUpdating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
            <Crown className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activando tu suscripción...</h2>
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Pago Exitoso!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Bienvenido a Koterie Premium! 
          </p>
          <p className="text-lg text-gray-600 mb-12">
            Ahora tienes acceso completo a foros, clases en vivo y contenido exclusivo.
          </p>

          {/* Features Unlocked */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Lo que tienes desbloqueado:</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-700">Foros Academy & Studio</span>
              </div>
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-700">Clase en vivo de 2 horas semanal</span>
              </div>
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-700">Contenido exclusivo</span>
              </div>
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-700">Soporte prioritario</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoToForums}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
            >
              Ir a los Foros
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleGoHome}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Ir al Inicio
            </button>
          </div>

          {/* Receipt Info */}
          <div className="mt-12 text-sm text-gray-500">
            <p>Recibirás un correo electrónico con tu recibo y detalles de la suscripción.</p>
            <p className="mt-2">Puedes cancelar tu suscripción en cualquier momento.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
