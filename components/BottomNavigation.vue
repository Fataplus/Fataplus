<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
    <div class="grid grid-cols-5 h-16">
      <!-- Home -->
      <NuxtLink 
        to="/" 
        class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
        :class="isActive('/') ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'"
      >
        <div class="relative">
          <i :class="isActive('/') ? 'ri-home-3-fill' : 'ri-home-3-line'" class="text-2xl"></i>
          <div v-if="isActive('/')" class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
        <span class="text-xs font-medium">Home</span>
      </NuxtLink>

      <!-- Marketplace -->
      <NuxtLink 
        to="/marketplace" 
        class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
        :class="isActive('/marketplace') ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'"
      >
        <div class="relative">
          <i :class="isActive('/marketplace') ? 'ri-store-2-fill' : 'ri-store-2-line'" class="text-2xl"></i>
          <div v-if="isActive('/marketplace')" class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
        <span class="text-xs font-medium">Marché</span>
      </NuxtLink>

      <!-- Learning -->
      <NuxtLink 
        to="/learning" 
        class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
        :class="isActive('/learning') ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'"
      >
        <div class="relative">
          <i :class="isActive('/learning') ? 'ri-graduation-cap-fill' : 'ri-graduation-cap-line'" class="text-2xl"></i>
          <div v-if="isActive('/learning')" class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
        <span class="text-xs font-medium">Formation</span>
      </NuxtLink>

      <!-- Community -->
      <NuxtLink 
        to="/community" 
        class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
        :class="isActive('/community') ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'"
      >
        <div class="relative">
          <i :class="isActive('/community') ? 'ri-team-fill' : 'ri-team-line'" class="text-2xl"></i>
          <div v-if="isActive('/community')" class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
        <span class="text-xs font-medium">Communauté</span>
      </NuxtLink>

      <!-- Profile/Account -->
      <div class="flex flex-col items-center justify-center space-y-1 transition-colors duration-200">
        <!-- If user is authenticated -->
        <NuxtLink 
          v-if="user" 
          to="/profile" 
          :class="isActive('/profile') ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'"
          class="flex flex-col items-center space-y-1"
        >
          <div class="relative">
            <i :class="isActive('/profile') ? 'ri-user-3-fill' : 'ri-user-3-line'" class="text-2xl"></i>
            <div v-if="isActive('/profile')" class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
          <span class="text-xs font-medium">Profil</span>
        </NuxtLink>

        <!-- If user is not authenticated -->
        <NuxtLink 
          v-else 
          to="/auth/login" 
          :class="isActive('/auth') ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'"
          class="flex flex-col items-center space-y-1"
        >
          <div class="relative">
            <i :class="isActive('/auth') ? 'ri-user-3-fill' : 'ri-user-3-line'" class="text-2xl"></i>
            <div v-if="isActive('/auth')" class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
          <span class="text-xs font-medium">Connexion</span>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Safe area for iPhones -->
    <div class="h-safe-area-inset-bottom bg-white"></div>
  </nav>
</template>

<script setup lang="ts">
// Use auth composable to check user status
const { user } = useAuth()

// Get current route
const route = useRoute()

// Helper function to check if route is active
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
/* Support for iPhone safe area */
.h-safe-area-inset-bottom {
  height: env(safe-area-inset-bottom);
}

/* Ensure the navigation doesn't interfere with content */
nav {
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}
</style> 