/*
export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    // Check if user is authenticated and has superadmin role
    const { data: user } = await $fetch('/api/auth/me')
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }
    
    // Only superadmin can access these routes
    if (user.role !== 'superadmin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied - SuperAdmin privileges required'
      })
    }
    
    // Store user info for use in superadmin pages
    useState('admin.user', () => user)
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'SuperAdmin access required'
    })
  }
})
*/
