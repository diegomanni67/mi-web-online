"use client"

import { useState } from "react"
import { Heart, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InterestSelectorProps {
  selectedInterests: string[]
  onInterestsChange: (interests: string[]) => void
  maxSelections?: number
}

const availableInterests = [
  "Cine", "Gaming", "Música", "Viajes", "Deportes", "Lectura", 
  "Cocina", "Fotografía", "Tecnología", "Arte", "Cripto", "Moda"
]

export function InterestSelector({ 
  selectedInterests, 
  onInterestsChange, 
  maxSelections = 12 
}: InterestSelectorProps) {
  const [customInterest, setCustomInterest] = useState("")

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      onInterestsChange(selectedInterests.filter(i => i !== interest))
    } else if (selectedInterests.length < maxSelections) {
      onInterestsChange([...selectedInterests, interest])
    }
  }

  const handleAddCustomInterest = () => {
    if (customInterest.trim() && 
        !availableInterests.includes(customInterest.trim()) && 
        !selectedInterests.includes(customInterest.trim()) &&
        selectedInterests.length < maxSelections) {
      onInterestsChange([...selectedInterests, customInterest.trim()])
      setCustomInterest("")
    }
  }

  const handleRemoveInterest = (interest: string) => {
    onInterestsChange(selectedInterests.filter(i => i !== interest))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[oklch(0.85_0.01_250)]">Mis Intereses</h3>
        <span className="text-sm text-[oklch(0.6_0.01_250)]">
          {selectedInterests.length}/{maxSelections}
        </span>
      </div>

      {/* Selected Interests */}
      {selectedInterests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedInterests.map((interest) => (
            <div
              key={interest}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] text-[oklch(0.99_0_0)] border border-[oklch(0.72_0.19_220/0.3)] transition-all duration-300 hover:shadow-[0_4px_20px_oklch(0.72_0.19_220/0.4)]"
            >
              <Heart className="size-3 fill-current" />
              <span className="text-sm font-medium">{interest}</span>
              <button
                onClick={() => handleRemoveInterest(interest)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Available Interests */}
      <div className="space-y-3">
        <p className="text-sm text-[oklch(0.6_0.01_250)]">
          Selecciona tus intereses (máximo {maxSelections}):
        </p>
        
        <div className="flex flex-wrap gap-2">
          {availableInterests.map((interest) => {
            const isSelected = selectedInterests.includes(interest)
            const isDisabled = !isSelected && selectedInterests.length >= maxSelections
            
            return (
              <button
                key={interest}
                onClick={() => handleToggleInterest(interest)}
                disabled={isDisabled}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border",
                  isSelected
                    ? "bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] text-[oklch(0.99_0_0)] border-[oklch(0.72_0.19_220/0.3)] shadow-[0_2px_10px_oklch(0.72_0.19_220/0.2)]"
                    : isDisabled
                    ? "bg-[oklch(0.1_0.02_250)] text-[oklch(0.4_0.01_250)] border-[oklch(0.15_0.03_250)] cursor-not-allowed"
                    : "bg-[oklch(0.1_0.02_250)] text-[oklch(0.7_0.01_250)] border-[oklch(0.2_0.03_250)] hover:bg-[oklch(0.72_0.19_220/0.1)] hover:text-[oklch(0.72_0.19_220)] hover:border-[oklch(0.72_0.19_220/0.3)]"
                )}
              >
                <span className="flex items-center gap-1">
                  {isSelected && <Heart className="size-3 fill-current" />}
                  {interest}
                </span>
              </button>
            )
          })}
        </div>

        {/* Custom Interest Input */}
        <div className="flex gap-2 pt-2 border-t border-[oklch(0.2_0.03_250)]">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomInterest()}
            placeholder="Agregar interés personalizado..."
            className="flex-1 px-3 py-2 rounded-xl bg-[oklch(0.1_0.02_250)] border border-[oklch(0.2_0.03_250)] text-[oklch(0.85_0.01_250)] placeholder-[oklch(0.5_0.01_250)] focus:outline-none focus:border-[oklch(0.72_0.19_220)] focus:ring-2 focus:ring-[oklch(0.72_0.19_220/0.2)] text-sm"
          />
          <button
            onClick={handleAddCustomInterest}
            disabled={!customInterest.trim() || selectedInterests.length >= maxSelections}
            className={cn(
              "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300",
              customInterest.trim() && selectedInterests.length < maxSelections
                ? "bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] text-[oklch(0.99_0_0)] hover:shadow-[0_4px_20px_oklch(0.72_0.19_220/0.4)]"
                : "bg-[oklch(0.1_0.02_250)] text-[oklch(0.5_0.01_250)] cursor-not-allowed"
            )}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
