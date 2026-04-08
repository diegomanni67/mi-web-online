"use client"

import { useState } from "react"
import { Calendar, CheckCircle, Clock, MessageCircle, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

interface LevelingStatusProps {
  levelingDate?: string
  userName?: string
  status?: 'pending' | 'scheduled' | 'completed'
}

export function LevelingStatus({ 
  levelingDate, 
  userName = "Estudiante", 
  status = 'pending' 
}: LevelingStatusProps) {
  const [isContacting, setIsContacting] = useState(false)

  const handleWhatsAppContact = () => {
    setIsContacting(true)
    const message = `Hola! Soy ${userName}, ya me inscribí en Koterie y quiero coordinar mi entrevista de nivelación.`
    const whatsappUrl = `https://wa.me/5491123456789?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    setTimeout(() => setIsContacting(false), 2000)
  }

  const getStatusContent = () => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle className="size-6 text-green-400" />,
          title: "Entrevista Completada",
          subtitle: "Tu nivel ha sido asignado",
          color: "from-green-600/20 to-emerald-600/20 border-green-600/30",
          textColor: "text-green-400"
        }
      case 'scheduled':
        return {
          icon: <Calendar className="size-6 text-blue-400" />,
          title: "Entrevista Agendada",
          subtitle: `Fecha: ${levelingDate}`,
          color: "from-blue-600/20 to-cyan-600/20 border-blue-600/30",
          textColor: "text-blue-400"
        }
      default:
        return {
          icon: <Clock className="size-6 text-yellow-400" />,
          title: "Estado de Nivelación",
          subtitle: "Pendiente de programar",
          color: "from-yellow-600/20 to-orange-600/20 border-yellow-600/30",
          textColor: "text-yellow-400"
        }
    }
  }

  const statusContent = getStatusContent()

  return (
    <div className={cn(
      "rounded-3xl glass border p-6 bg-gradient-to-br",
      statusContent.color
    )}>
      <div className="flex items-center gap-4 mb-6">
        <div className="size-12 rounded-2xl bg-[oklch(0.1_0.02_250)] flex items-center justify-center">
          {statusContent.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-[oklch(0.95_0.01_250)] mb-1">
            {statusContent.title}
          </h3>
          <p className={cn("text-sm", statusContent.textColor)}>
            {statusContent.subtitle}
          </p>
        </div>
      </div>

      {status === 'completed' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[oklch(0.1_0.02_250)] border border-[oklch(0.2_0.03_250)]">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="size-5 text-green-400" />
              <span className="font-semibold text-[oklch(0.85_0.01_250)]">Nivel Asignado</span>
            </div>
            <div className="text-2xl font-black bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] bg-clip-text text-transparent">
              Academy B1
            </div>
            <p className="text-sm text-[oklch(0.6_0.01_250)] mt-1">
              ¡Felicidades! Ya puedes acceder a tus clases y foros
            </p>
          </div>
        </div>
      ) : status === 'scheduled' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[oklch(0.1_0.02_250)] border border-[oklch(0.2_0.03_250)]">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="size-5 text-blue-400" />
              <span className="font-semibold text-[oklch(0.85_0.01_250)]">Detalles de la Entrevista</span>
            </div>
            <p className="text-[oklch(0.7_0.01_250)]">
              La entrevista durará aproximadamente 30 minutos y se realizará vía videollamada.
            </p>
            <p className="text-sm text-[oklch(0.6_0.01_250)] mt-2">
              Prepárate para conversar en inglés sobre tus intereses y metas.
            </p>
          </div>
          
          <button
            onClick={handleWhatsAppContact}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[oklch(0.72_0.19_220/0.2)] text-[oklch(0.72_0.19_220)] hover:bg-[oklch(0.72_0.19_220/0.3)] transition-colors"
          >
            <MessageCircle className="size-5" />
            <span>Contactar por WhatsApp</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[oklch(0.1_0.02_250)] border border-[oklch(0.2_0.03_250)]">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="size-5 text-yellow-400" />
              <span className="font-semibold text-[oklch(0.85_0.01_250)]">Próximo Paso</span>
            </div>
            <p className="text-[oklch(0.7_0.01_250)] mb-3">
              Para asignarte el nivel correcto, necesitamos hacer una breve entrevista de nivelación.
            </p>
            <div className="space-y-2 text-sm text-[oklch(0.6_0.01_250)]">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-yellow-400" />
                <span>Duración: 30 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-yellow-400" />
                <span>Modalidad: Videollamada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-yellow-400" />
                <span>Objetivo: Evaluar tu nivel actual</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsAppContact}
            disabled={isContacting}
            className={cn(
              "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
              isContacting 
                ? "bg-green-600/20 text-green-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] text-[oklch(0.99_0_0)] hover:shadow-[0_8px_30px_oklch(0.72_0.19_220/0.4)] hover:scale-[1.02]"
            )}
          >
            {isContacting ? (
              <>
                <Phone className="size-5 animate-pulse" />
                <span>Abriendo WhatsApp...</span>
              </>
            ) : (
              <>
                <MessageCircle className="size-5" />
                <span>Contactar Profe por WhatsApp</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
