/*
// Simple auth composable without Pinia
interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Global state using Vue's reactivity
const authState = reactive<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: false
})

export const useAuth = () => {
  // Computed values
  const user = computed(() => authState.user)
  const isAuthenticated = computed(() => authState.isAuthenticated)
  const isLoading = computed(() => authState.isLoading)

  // Initialize auth
  const initializeAuth = async () => {
    authState.isLoading = true
    try {
      // Check for token in cookies
      const token = useCookie('auth-token', {
        default: () => null,
        secure: true,
        sameSite: 'strict'
      })

      if (token.value) {
        await fetchUser(token.value)
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      await logout()
    } finally {
      authState.isLoading = false
    }
  }

  // Fetch user profile
  const fetchUser = async (token: string) => {
    try {
      const { data } = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      authState.user = data
      authState.isAuthenticated = true
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    }
  }

  // Login
  const login = async (credentials: { email: string; password: string }) => {
    authState.isLoading = true
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      // Store token
      const token = useCookie('auth-token', {
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      token.value = response.data.token

      // Update state
      authState.user = response.data.user
      authState.isAuthenticated = true

      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Login failed' 
      }
    } finally {
      authState.isLoading = false
    }
  }

  // Register
  const register = async (userData: any) => {
    authState.isLoading = true
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData
      })

      // Auto-login if enabled
      if (response.data.autoLogin) {
        const token = useCookie('auth-token')
        token.value = response.data.token
        authState.user = response.data.user
        authState.isAuthenticated = true
      }

      return { success: true }
    } catch (error: any) {
      console.error('Register error:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Registration failed' 
      }
    } finally {
      authState.isLoading = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      // Clear server session if authenticated
      const token = useCookie('auth-token')
      if (token.value) {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state
      authState.user = null
      authState.isAuthenticated = false
      
      // Clear token
      const token = useCookie('auth-token')
      token.value = null

      // Redirect to home
      await navigateTo('/')
    }
  }

  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    
    // Actions
    initializeAuth,
    login,
    register,
    logout
  }
} 