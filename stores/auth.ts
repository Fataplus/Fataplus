import type { User } from '~/server/database/schema'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role?: 'farmer' | 'buyer' | 'mentor' | 'trainer'
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    token: null
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isFarmer: (state) => state.user?.role === 'farmer',
    isBuyer: (state) => state.user?.role === 'buyer',
    isMentor: (state) => state.user?.role === 'mentor',
    isTrainer: (state) => state.user?.role === 'trainer',
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    initials: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName?.[0] || ''}${state.user.lastName?.[0] || ''}`.toUpperCase()
    }
  },

  actions: {
    async initializeAuth() {
      this.isLoading = true
      try {
        // Vérifier le token dans les cookies
        const token = useCookie('auth-token', {
          default: () => null,
          secure: true,
          sameSite: 'strict'
        })

        if (token.value) {
          this.token = token.value
          await this.fetchUser()
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error)
        await this.logout()
      } finally {
        this.isLoading = false
      }
    },

    async login(credentials: LoginCredentials) {
      this.isLoading = true
      try {
        const { data } = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        this.token = data.token
        this.user = data.user
        this.isAuthenticated = true

        // Sauvegarder le token dans les cookies
        const token = useCookie('auth-token', {
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7 // 7 jours
        })
        token.value = data.token

        // Redirection selon le rôle
        const redirectPath = this.getRedirectPath()
        await navigateTo(redirectPath)

        // Notification de succès
        useToast().add({
          title: 'Connexion réussie',
          description: `Bienvenue ${this.user?.firstName} !`,
          color: 'green'
        })

        return { success: true }
      } catch (error: any) {
        useToast().add({
          title: 'Erreur de connexion',
          description: error.data?.message || 'Email ou mot de passe incorrect',
          color: 'red'
        })
        return { success: false, error: error.data?.message }
      } finally {
        this.isLoading = false
      }
    },

    async register(data: RegisterData) {
      this.isLoading = true
      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: data
        })

        useToast().add({
          title: 'Inscription réussie',
          description: 'Votre compte a été créé avec succès. Vérifiez votre email.',
          color: 'green'
        })

        // Auto-login après inscription
        if (response.data.autoLogin) {
          this.token = response.data.token
          this.user = response.data.user
          this.isAuthenticated = true

          const token = useCookie('auth-token')
          token.value = response.data.token

          await navigateTo('/dashboard')
        } else {
          await navigateTo('/auth/verify-email')
        }

        return { success: true }
      } catch (error: any) {
        useToast().add({
          title: 'Erreur d\'inscription',
          description: error.data?.message || 'Une erreur est survenue',
          color: 'red'
        })
        return { success: false, error: error.data?.message }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        if (this.token) {
          await $fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
      }

      // Nettoyer l'état
      this.user = null
      this.token = null
      this.isAuthenticated = false

      // Supprimer le token des cookies
      const token = useCookie('auth-token')
      token.value = null

      // Redirection vers la page d'accueil
      await navigateTo('/')

      useToast().add({
        title: 'Déconnexion réussie',
        description: 'À bientôt !',
        color: 'blue'
      })
    },

    async fetchUser() {
      if (!this.token) return

      try {
        const { data } = await $fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        this.user = data
        this.isAuthenticated = true
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
        await this.logout()
      }
    },

    async updateProfile(updates: Partial<User>) {
      if (!this.user) return

      this.isLoading = true
      try {
        const { data } = await $fetch('/api/auth/profile', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: updates
        })

        this.user = { ...this.user, ...data }

        useToast().add({
          title: 'Profil mis à jour',
          description: 'Vos informations ont été sauvegardées',
          color: 'green'
        })

        return { success: true }
      } catch (error: any) {
        useToast().add({
          title: 'Erreur de mise à jour',
          description: error.data?.message || 'Une erreur est survenue',
          color: 'red'
        })
        return { success: false, error: error.data?.message }
      } finally {
        this.isLoading = false
      }
    },

    async changePassword(currentPassword: string, newPassword: string) {
      this.isLoading = true
      try {
        await $fetch('/api/auth/change-password', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: {
            currentPassword,
            newPassword
          }
        })

        useToast().add({
          title: 'Mot de passe modifié',
          description: 'Votre mot de passe a été mis à jour',
          color: 'green'
        })

        return { success: true }
      } catch (error: any) {
        useToast().add({
          title: 'Erreur',
          description: error.data?.message || 'Mot de passe actuel incorrect',
          color: 'red'
        })
        return { success: false, error: error.data?.message }
      } finally {
        this.isLoading = false
      }
    },

    async requestPasswordReset(email: string) {
      try {
        await $fetch('/api/auth/forgot-password', {
          method: 'POST',
          body: { email }
        })

        useToast().add({
          title: 'Email envoyé',
          description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe',
          color: 'blue'
        })

        return { success: true }
      } catch (error: any) {
        useToast().add({
          title: 'Erreur',
          description: error.data?.message || 'Une erreur est survenue',
          color: 'red'
        })
        return { success: false, error: error.data?.message }
      }
    },

    async resetPassword(token: string, password: string) {
      try {
        await $fetch('/api/auth/reset-password', {
          method: 'POST',
          body: { token, password }
        })

        useToast().add({
          title: 'Mot de passe réinitialisé',
          description: 'Vous pouvez maintenant vous connecter',
          color: 'green'
        })

        await navigateTo('/auth/login')
        return { success: true }
      } catch (error: any) {
        useToast().add({
          title: 'Erreur',
          description: error.data?.message || 'Token invalide ou expiré',
          color: 'red'
        })
        return { success: false, error: error.data?.message }
      }
    },

    async verifyEmail(token: string) {
      try {
        await $fetch('/api/auth/verify-email', {
          method: 'POST',
          body: { token }
        })

        useToast().add({
          title: 'Email vérifié',
          description: 'Votre compte est maintenant activé',
          color: 'green'
        })

        await this.fetchUser() // Rafraîchir les données utilisateur
        return { success: true }
      } catch (error: any) {
        useToast().add({
          title: 'Erreur de vérification',
          description: error.data?.message || 'Token invalide ou expiré',
          color: 'red'
        })
        return { success: false, error: error.data?.message }
      }
    },

    getRedirectPath(): string {
      if (!this.user) return '/'
      
      switch (this.user.role) {
        case 'admin':
          return '/admin/dashboard'
        case 'farmer':
          return '/farmer/dashboard'
        case 'buyer':
          return '/buyer/dashboard'
        case 'mentor':
          return '/mentor/dashboard'
        case 'trainer':
          return '/trainer/dashboard'
        default:
          return '/dashboard'
      }
    }
  }
})

// Middleware d'authentification
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuthStore()
  
  return {
    requireAuth: (redirectTo = '/auth/login') => {
      if (!isLoading && !isAuthenticated) {
        navigateTo(redirectTo)
        return false
      }
      return true
    },
    
    requireRole: (roles: string[], redirectTo = '/') => {
      const { user } = useAuthStore()
      if (!user || !roles.includes(user.role)) {
        navigateTo(redirectTo)
        return false
      }
      return true
    }
  }
} 