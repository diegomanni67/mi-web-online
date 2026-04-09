"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { ForumCategoriesDashboard } from "@/components/forum/ForumCategoriesDashboard"

export default function AcademyForumPage() {
  // VERSIÓN LOCAL ABIERTA - ACCESO DIRECTO SIN VERIFICACIONES
  
  // Datos específicos para Academy
  const academyPosts = [
    {
      id: 1,
      title: "¡Bienvenidos al foro de Academy!",
      author: "Prof. Sarah Mitchell",
      role: "Academy Instructor",
      category: "general",
      content: "Este es el espacio oficial para todos los estudiantes de Academy. Aquí podrán compartir dudas, recursos y experiencias de aprendizaje.",
      replies: 24,
      views: 156,
      lastActivity: "Hace 2 horas",
      pinned: true,
      tags: ["bienvenida", "anuncios"]
    },
    {
      id: 2,
      title: "Duda con el Present Perfect",
      author: "María González",
      role: "Estudiante A2",
      category: "grammar",
      content: "Hola a todos, estoy teniendo dificultades para entender cuándo usar el Present Perfect. ¿Alguien puede explicarme la diferencia entre 'I have eaten' y 'I was eating'?",
      replies: 8,
      views: 45,
      lastActivity: "Hace 1 hora",
      tags: ["gramática", "presente perfecto", "duda"]
    },
    {
      id: 3,
      title: "Recomendación: App para practicar listening",
      author: "Carlos Rodriguez",
      role: "Estudiante B1",
      category: "practice",
      content: "Quiero compartir esta aplicación increíble que encontré para practicar listening. Se llama 'English Listening Lab' y tiene ejercicios con diferentes acentos.",
      replies: 12,
      views: 78,
      lastActivity: "Hace 30 minutos",
      tags: ["recomendación", "listening", "apps"]
    },
    {
      id: 4,
      title: "Vocabulario: Phrasal Verbs comunes",
      author: "Ana Martínez",
      role: "Estudiante A2",
      category: "vocabulary",
      content: "Hola comunidad, quería compartir una lista de phrasal verbs que me han sido muy útiles en mi aprendizaje. Algunos de los más comunes son: 'look forward to', 'give up', 'carry out', etc.",
      replies: 15,
      views: 92,
      lastActivity: "Hace 3 horas",
      tags: ["vocabulario", "phrasal verbs", "lista"]
    },
    {
      id: 5,
      title: "Tips para mejorar la pronunciación",
      author: "Prof. David Chen",
      role: "Academy Instructor",
      category: "practice",
      content: "Hola estudiantes, hoy quiero compartirles algunos tips prácticos para mejorar su pronunciación en inglés. 1. Escucha podcasts nativos, 2. Grábate y escúchate, 3. Practica frente a un espejo.",
      replies: 23,
      views: 167,
      lastActivity: "Hace 5 horas",
      tags: ["pronunciación", "tips", "práctica"]
    }
  ]

  const academyCategories = [
    { id: 'general', name: 'General', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'grammar', name: 'Gramática', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'vocabulary', name: 'Vocabulario', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'practice', name: 'Práctica', color: 'bg-orange-100 text-orange-800 border-orange-200' }
  ]

  return <ForumCategoriesDashboard forumType="academy" />
}
