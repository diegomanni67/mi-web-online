"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CreditCard, Crown, Lock, CheckCircle, Star, Users, BookOpen, Video } from 'lucide-react'

export default function PricingPage() {
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

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simular proceso de pago (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirigir a página de éxito
    router.push('/upgrade/success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Elige tu Plan Koterie
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Acceso premium a foros exclusivos, clases en vivo y una comunidad de apasionados por los idiomas
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Gratis</h3>
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-600">/mes</span></div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Perfil básico</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Directorio de alumnos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Chat básico</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-400">Foros privados</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-400">Clases en vivo</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-400">Contenido exclusivo</span>
                </li>
              </ul>

              <button 
                disabled 
                className="w-full px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl font-medium cursor-not-allowed"
              >
                Plan Actual
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden transform scale-105">
              <div className="absolute top-4 right-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                RECOMENDADO
              </div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Premium</h3>
                <Crown className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="text-4xl font-bold mb-6">$19<span className="text-lg opacity-90">/mes</span></div>
              
              <ul className="space-y-4 mb-8">
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
                  <span>Clase en vivo de 2 horas semanal</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Contenido exclusivo</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Chat prioritario</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Soporte prioritario</span>
                </li>
              </ul>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-purple-600 rounded-2xl hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Actualizar a Premium
                  </>
                )}
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-6">$49<span className="text-lg text-gray-600">/mes</span></div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Todo Premium +</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Clases privadas 1:1</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Certificados oficiales</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Acceso para empresas</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">API integrada</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Manager dedicado</span>
                </li>
              </ul>

              <button className="w-full px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-200 font-medium">
                Contactar Ventas
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Todo lo que obtienes con Koterie Premium
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Comunidad Exclusiva</h3>
                <p className="text-gray-600">
                  Acceso a foros privados con alumnos de todo el mundo
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  <Video className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Clases en Vivo</h3>
                <p className="text-gray-600">
                  Sesiones interactivas con profesores nativos
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Contenido Premium</h3>
                <p className="text-gray-600">
                  Material exclusivo y recursos de aprendizaje avanzados
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-6">
              ¿Preguntas? Habla con nuestro equipo de soporte
            </p>
            <a 
              href="https://wa.me/5491123456789" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.466-1.136-1.004-1.9-2.247-2.191-2.543-.291-.297-.023-.464.149-.661.173-.197.462-.767.661-.94.199-.173.297-.347.297-.644 0-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67-.149-.197 0-.395.149-.592.297-.197.149-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.466-1.136-1.004-1.9-2.247-2.191-2.543-.291-.297-.023-.464.149-.661.173-.197.462-.767.661-.94.199-.173.297-.347.297-.644 0-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67-.149-.197 0-.395.149-.592.297z"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Chatear con Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
