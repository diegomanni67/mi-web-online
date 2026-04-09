import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserRole } from '@/lib/types'

const handler = NextAuth({
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Login temporal para pruebas
        if (credentials?.email === "admin@koterie.com" && credentials?.password === "admin123") {
          return {
            id: "1",
            email: "diegomanni67@gmail.com",
            name: "Admin Koterie",
            role: UserRole.ADMIN,
            hasPaid: true
          }
        }
        if (credentials?.email === "user@koterie.com" && credentials?.password === "user123") {
          return {
            id: "2", 
            email: "user@koterie.com",
            name: "Usuario Koterie",
            role: UserRole.STUDENT_ACADEMY,
            hasPaid: false
          }
        }
        if (credentials?.email === "paid@koterie.com" && credentials?.password === "paid123") {
          return {
            id: "3",
            email: "paid@koterie.com", 
            name: "Usuario Pagado",
            role: UserRole.STUDENT_STUDIO,
            hasPaid: true
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('NextAuth redirect callback:', { url, baseUrl })
      // Si el login es exitoso, redirigir al checkout para que pague
      if (url.startsWith(baseUrl)) {
        return '/checkout'
      }
      return baseUrl
    },
    async session({ session, token }) {
      // Agregar el rol del usuario a la sesión
      if (session.user && token) {
        session.user.id = token.sub!
        session.user.role = (token.role as UserRole) || UserRole.STUDENT_ACADEMY
        
        // Agregar campo de pago (default false para prueba)
        // Bypass para email específico (admin access) y profesoras
        const userEmail = session.user.email
        const isAdminUser = userEmail === 'diegomanni67@gmail.com'
        const isProfessor = userEmail === '[MAIL1]' || userEmail === '[MAIL2]'
        
        session.user.hasPaid = isAdminUser || isProfessor || ((token.hasPaid as boolean) || false)
      }
      return session
    },
    async jwt({ token, user }) {
      // Asignar rol y pago al primer login con credenciales
      if (user) {
        token.role = user.role || UserRole.STUDENT_ACADEMY
        token.hasPaid = user.hasPaid || false
      }
      return token
    },
    async signIn({ user, account }) {
      console.log('NextAuth signIn callback:', { user: user?.email, provider: account?.provider })
      // Aquí podrías verificar si el usuario existe en tu base de datos
      // y crear su perfil si es la primera vez
      return true
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  }
})

export { handler as GET, handler as POST }
