import { DefaultSession } from 'next-auth'
import { UserRole } from '@/lib/types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      hasPaid: boolean
      subscriptionLevel?: 'academy' | 'studio'
    } & DefaultSession['user']
  }

  interface User {
    role?: UserRole
    hasPaid?: boolean
    subscriptionLevel?: 'academy' | 'studio'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole
    hasPaid?: boolean
  }
}
