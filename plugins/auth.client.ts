export default defineNuxtPlugin(async () => {
  // Initialize auth on client side
  const { initializeAuth } = useAuth()
  
  // Only run on client side to avoid hydration mismatches
  if (process.client) {
    await initializeAuth()
  }
}) 