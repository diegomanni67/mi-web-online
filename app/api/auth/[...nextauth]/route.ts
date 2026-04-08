import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
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
      // Asignar rol por defecto al primer login
      if (user) {
        token.role = UserRole.STUDENT_ACADEMY
        
        // Set hasPaid to false by default for new users
        // Bypass for admin email y profesoras
        const isAdminUser = user.email === 'diegomanni67@gmail.com'
        const isProfessor = user.email === '[MAIL1]' || user.email === '[MAIL2]'
        token.hasPaid = isAdminUser || isProfessor || false
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
