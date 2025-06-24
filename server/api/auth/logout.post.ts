export default defineEventHandler(async (event) => {
  // For stateless JWT auth, logout is handled client-side
  // This endpoint can be used for logging logout events
  
  return {
    success: true,
    message: 'Déconnexion réussie'
  }
}) 