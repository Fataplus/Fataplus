/*
export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    // Check if user is authenticated and has admin/superadmin role
    const { data: user } = await $fetch('/api/auth/me')
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }
    
    // Only admin and superadmin can access admin routes
    if (!['admin', 'superadmin'].includes(user.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied - Admin privileges required'
      })
    }
    
    // Store user info for use in admin pages
    useState('admin.user', () => user)
    
  } catch (error: any) {
    // Redirect to login page with return URL
    const returnUrl = encodeURIComponent(to.fullPath)
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'Access denied'
    })
  }
})
*/
