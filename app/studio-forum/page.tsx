"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ForumCategoriesDashboard } from "@/components/forum/ForumCategoriesDashboard"

export default function StudioForumPage() {
  const router = useRouter()

  // VERSIÓN LOCAL ABIERTA - ACCESO DIRECTO
  useEffect(() => {
    // Sin redirecciones en versión local
  }, [])

  // VERSIÓN LOCAL ABIERTA - ACCESO DIRECTO
  if (false) { // Siempre mostrar contenido en versión local
    return null
  }
  // Datos específicos para Studio
  const studioPosts = [
    {
      id: 1,
      title: "¡Bienvenidos al Studio Forum!",
      author: "Prof. James Chen",
      role: "Profesor",
      category: "general",
      content: "Espacio exclusivo para estudiantes avanzados B1+. Aquí practicamos inglés profesional y de negocios.",
      replies: 67,
      views: 456,
      lastActivity: "Hace 1 hora",
      pinned: true,
      tags: ["bienvenida", "anuncios"],
      mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      timestamp: "2024-01-15 10:30"
    },
    {
      id: 2,
      title: "Tips para presentaciones en inglés",
      author: "Laura Martínez",
      role: "Estudiante Avanzado",
      category: "business",
      content: "Comparto mis mejores técnicas para presentaciones corporativas efectivas. Incluye estructura, lenguaje corporal y manejo de preguntas.",
      replies: 34,
      views: 289,
      lastActivity: "Hace 45 minutos",
      tags: ["presentaciones", "negocios", "tips"],
      mediaUrl: "https://picsum.photos/seed/business/800/400.jpg",
      timestamp: "2024-01-15 09:15"
    },
    {
      id: 3,
      title: "Práctica: Debates semanales",
      author: "Diego Fernández",
      role: "Estudiante Avanzado",
      category: "fluency",
      content: "Organizamos debates sobre temas actuales para mejorar fluidez. ¡Únanse! Cada jueves a las 7PM.",
      replies: 89,
      views: 623,
      lastActivity: "Hace 20 minutos",
      tags: ["debates", "práctica", "fluidez"],
      mediaUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
      timestamp: "2024-01-15 08:45"
    },
    {
      id: 4,
      title: "Networking en inglés - Estrategias",
      author: "Sofia Rodríguez",
      role: "Estudiante Avanzado",
      category: "advanced",
      content: "Cómo construir relaciones profesionales internacionales usando el inglés como herramienta. Tips para LinkedIn y eventos.",
      replies: 45,
      views: 367,
      lastActivity: "Hace 10 minutos",
      tags: ["networking", "profesional", "linkedin"],
      mediaUrl: "https://picsum.photos/seed/networking/800/400.jpg",
      timestamp: "2024-01-15 07:30"
    }
  ]

  const studioCategories = [
    { id: 'general', name: 'General', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'business', name: 'Negocios', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'fluency', name: 'Fluidez', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'advanced', name: 'Avanzado', color: 'bg-red-100 text-red-800 border-red-200' }
  ]

  return <ForumCategoriesDashboard forumType="studio" />
}
