import { useState, useEffect } from 'react'

export type UserRole = 'academy' | 'studio' | 'both' | 'none'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  level: string
  joinedAt: Date
}

// Simulación de base de datos local
class UserRankService {
  private users: Map<string, UserProfile> = new Map()
  private currentUser: UserProfile | null = null

  constructor() {
    // Inicializar con usuarios de prueba
    this.initializeTestUsers()
  }

  private initializeTestUsers() {
    // Usuario con acceso a Academy
    this.users.set('academy_user@example.com', {
      id: '1',
      name: 'Academy Student',
      email: 'academy_user@example.com',
      role: 'academy',
      level: 'A2',
      joinedAt: new Date()
    })

    // Usuario con acceso a Studio
    this.users.set('studio_user@example.com', {
      id: '2',
      name: 'Studio Student',
      email: 'studio_user@example.com',
      role: 'studio',
      level: 'B1',
      joinedAt: new Date()
    })

    // Usuario con acceso a ambos
    this.users.set('both_user@example.com', {
      id: '3',
      name: 'Advanced Student',
      email: 'both_user@example.com',
      role: 'both',
      level: 'C1',
      joinedAt: new Date()
    })

    // Usuario sin acceso
    this.users.set('none_user@example.com', {
      id: '4',
      name: 'New Student',
      email: 'none_user@example.com',
      role: 'none',
      level: 'A1',
      joinedAt: new Date()
    })
  }

  // Simular login
  login(email: string, password: string): UserProfile | null {
    const user = this.users.get(email)
    if (user) {
      this.currentUser = user
      // Guardar en localStorage para persistencia
      if (typeof window !== 'undefined') {
        localStorage.setItem('koterie_user', JSON.stringify(user))
      }
      return user
    }
    return null
  }


  // Obtener usuario actual
  getCurrentUser(): UserProfile | null {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koterie_user')
      if (saved) {
        this.currentUser = JSON.parse(saved)
      }
    }
    return this.currentUser
  }

  // Cerrar sesión
  logout() {
    this.currentUser = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('koterie_user')
    }
  }

  // Verificar acceso a foros
  hasAccessToForum(forum: 'academy' | 'studio'): boolean {
    const user = this.getCurrentUser()
    if (!user) return false
    
    if (user.role === 'both') return true
    return user.role === forum
  }

  // Asignar rol (para pruebas)
  assignRole(email: string, role: UserRole): boolean {
    const user = this.users.get(email)
    if (user) {
      user.role = role
      if (this.currentUser?.email === email) {
        this.currentUser = user
        if (typeof window !== 'undefined') {
          localStorage.setItem('koterie_user', JSON.stringify(user))
        }
      }
      return true
    }
    return false
  }

  // Obtener todos los usuarios (para admin)
  getAllUsers(): UserProfile[] {
    return Array.from(this.users.values())
  }
}

export const userRankService = new UserRankService()

// Hook de React para usar el servicio
export function useUserRank() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = userRankService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    const loggedInUser = userRankService.login(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }


  const logout = () => {
    userRankService.logout()
    setUser(null)
  }

  const hasAccess = (forum: 'academy' | 'studio') => {
    return userRankService.hasAccessToForum(forum)
  }

  return {
    user,
    loading,
    login,
    logout,
    hasAccess
  }
}
