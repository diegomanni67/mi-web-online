"use client"

import { useState } from "react"
import { Edit3, Save, X, Camera, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileHeaderProps {
  userName?: string
  userBio?: string
  userAvatar?: string
  onBioUpdate?: (bio: string) => void
  isEditable?: boolean
}

export function ProfileHeader({ 
  userName = "Estudiante", 
  userBio = "",
  userAvatar = "",
  onBioUpdate,
  isEditable = true
}: ProfileHeaderProps) {
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bio, setBio] = useState(userBio)
  const [tempBio, setTempBio] = useState(userBio)

  const handleSaveBio = () => {
    setBio(tempBio)
    setIsEditingBio(false)
    onBioUpdate?.(tempBio)
  }

  const handleCancelBio = () => {
    setTempBio(bio)
    setIsEditingBio(false)
  }

  return (
    <div className="rounded-3xl glass border border-[oklch(0.2_0.03_250)] p-6 bg-gradient-to-br from-[oklch(0.12_0.02_250)] to-[oklch(0.15_0.03_260)]">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Section */}
        <div className="relative">
          <div className="size-24 rounded-full bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] flex items-center justify-center shadow-[0_8px_30px_oklch(0.72_0.19_220/0.3)]">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName}
                className="size-full rounded-full object-cover"
              />
            ) : (
              <User className="size-12 text-[oklch(0.99_0_0)]" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 size-8 rounded-full bg-[oklch(0.72_0.19_220)] text-[oklch(0.99_0_0)] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Camera className="size-4" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-[oklch(0.95_0.01_250)] mb-2">
            {userName}
          </h2>
          
          {/* Bio Section */}
          <div className="space-y-3">
            {isEditable && !isEditingBio ? (
              <div className="relative group">
                <p className="text-[oklch(0.7_0.01_250)] leading-relaxed">
                  {bio || "Aún no has agregado tu biografía. Cuéntanos sobre ti..."}
                </p>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-[oklch(0.72_0.19_220/0.2)] text-[oklch(0.72_0.19_220)] hover:bg-[oklch(0.72_0.19_220/0.3)]"
                >
                  <Edit3 className="size-3" />
                </button>
              </div>
            ) : isEditable ? (
              <div className="space-y-2">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Cuéntanos sobre ti, tus intereses y metas..."
                  className="w-full p-3 rounded-2xl bg-[oklch(0.1_0.02_250)] border border-[oklch(0.2_0.03_250)] text-[oklch(0.85_0.01_250)] placeholder-[oklch(0.5_0.01_250)] focus:outline-none focus:border-[oklch(0.72_0.19_220)] focus:ring-2 focus:ring-[oklch(0.72_0.19_220/0.2)] resize-none"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancelBio}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors text-sm"
                  >
                    <X className="size-3" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveBio}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors text-sm"
                  >
                    <Save className="size-3" />
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <p className="text-[oklch(0.7_0.01_250)] leading-relaxed">
                  {bio || "Biografía no disponible"}
                </p>
              </div>
            )}
          </div>

          {/* User Stats */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-[oklch(0.6_0.01_250)]">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-400" />
              <span>Miembro activo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue-400" />
              <span>Academy B1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-purple-400" />
              <span>Desde Enero 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
