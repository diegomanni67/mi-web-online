"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SharedForumLayout } from "@/components/forum/shared-forum-layout"

export default function StudioForumPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      // Check for Studio level access
      const hasStudioAccess = session.user.subscriptionLevel === 'studio' || 
        session.user.email === 'diegomanni67@gmail.com';
      
      if (!hasStudioAccess) {
        // If user has Academy level, redirect to Academy forum
        if (session.user.subscriptionLevel === 'academy') {
          router.push('/academy-forum');
        } else {
          // No subscription, redirect to checkout
          router.push('/checkout');
        }
      }
    }
  }, [status, router, session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
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

  return (
    <SharedForumLayout
      forumType="studio"
      posts={studioPosts}
      categories={studioCategories}
      title="Koterie Studio"
      description="Comunidad exclusiva para estudiantes avanzados B1+"
      memberCount="856"
      activeNow={124}
    >
      {/* Content will be handled by the layout itself */}
    </SharedForumLayout>
  )
}
