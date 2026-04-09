"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { useState, useEffect } from "react"
import { forumStorage, DownloadLink } from "@/lib/forum-storage"
import { FileText, Plus, X, ExternalLink, Clock, User } from "lucide-react"

interface MaterialSubcategoryViewProps {
  subcategoryId: string
  subcategoryName: string
  subcategoryDescription: string
  onBack: () => void
  staticLinks: Array<{ name: string; url: string }>
}

export function MaterialSubcategoryView({
  subcategoryId,
  subcategoryName,
  subcategoryDescription,
  onBack,
  staticLinks
}: MaterialSubcategoryViewProps) {
  const [dynamicLinks, setDynamicLinks] = useState<DownloadLink[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLinkName, setNewLinkName] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const links = await forumStorage.getMaterialLinks(subcategoryId)
        setDynamicLinks(links)
      } catch (error) {
        console.error('Error loading links:', error)
        setDynamicLinks([])
      }
    }

    loadLinks()
  }, [subcategoryId])

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()

    // VERSIÓN LOCAL ABIERTA - SIN VERIFICACIÓN DE SESIÓN

    if (!newLinkName.trim() || !newLinkUrl.trim()) {
      setError("El nombre y la URL son obligatorios")
      return
    }

    if (!newLinkUrl.startsWith('http://') && !newLinkUrl.startsWith('https://')) {
      setError("La URL debe comenzar con http:// o https://")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await forumStorage.addMaterialLink(subcategoryId, {
        name: newLinkName.trim(),
        url: newLinkUrl.trim(),
        addedBy: "Usuario Invitado" // VERSIÓN LOCAL ABIERTA
      })

      // Reload links
      const updatedLinks = await forumStorage.getMaterialLinks(subcategoryId)
      setDynamicLinks(updatedLinks)

      // Reset form
      setNewLinkName("")
      setNewLinkUrl("")
      setShowAddForm(false)
    } catch (err) {
      setError("Error al agregar el enlace. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const allLinks = [
    ...staticLinks.map(link => ({ ...link, addedBy: "System", addedAt: new Date(0) })),
    ...dynamicLinks
  ]

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
    } else if (diffInHours > 0) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    } else {
      return "Hace unos minutos"
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <span className="flex items-center gap-2">
            <span>Back to Material</span>
          </span>
        </button>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
            {subcategoryName}
          </h2>
          <p className="text-gray-300 mb-8">{subcategoryDescription}</p>

          {/* Add Link Button - VERSIÓN LOCAL ABIERTA */}
          <div className="mb-6">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Nuevo Enlace
                </button>
              ) : (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Agregar Nuevo Enlace</h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <form onSubmit={handleAddLink} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre del Recurso *
                      </label>
                      <input
                        type="text"
                        value={newLinkName}
                        onChange={(e) => setNewLinkName(e.target.value)}
                        placeholder="Ej: Grammar Book PDF"
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:border-amber-500/50 focus:outline-none transition-all duration-300 placeholder-gray-500"
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL de Descarga *
                      </label>
                      <input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="https://ejemplo.com/recurso.pdf"
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:border-amber-500/50 focus:outline-none transition-all duration-300 placeholder-gray-500"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !newLinkName.trim() || !newLinkUrl.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Agregando...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            Agregar Enlace
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )

          {/* Links List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Recursos Disponibles ({allLinks.length})
            </h3>

            {allLinks.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No hay recursos disponibles
                </h3>
                <p className="text-gray-500 mb-6">
                  Sé el primero en agregar un recurso
                </p>
              </div>
            ) : (
              allLinks.map((link, index) => (
                <div
                  key={`${link.name}-${index}`}
                  className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-amber-400" />
                      <div>
                        <h4 className="text-white font-medium">{link.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{link.addedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(link.addedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {link.url.startsWith('#') ? 'Ver' : 'Descargar'}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
