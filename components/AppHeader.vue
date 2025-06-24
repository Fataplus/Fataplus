<template>
  <header class="bg-white shadow border-b hidden md:block">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <!-- Simple navigation header -->
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="text-2xl font-bold text-green-600 hover:text-green-700 transition cursor-pointer">
            🌱 Fataplus
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <button class="text-gray-600 hover:text-green-600 transition">
            🛒 Marché
          </button>
          <button class="text-gray-600 hover:text-blue-600 transition">
            📚 Formation
          </button>
          <button class="text-gray-600 hover:text-purple-600 transition">
            👥 Communauté
          </button>
        </nav>

        <!-- User Section -->
        <div class="flex items-center space-x-4">
          <!-- Auth buttons -->
          <div v-if="!user" class="space-x-2">
            <NuxtLink 
              to="/auth/login"
              class="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition inline-block"
            >
              Connexion
            </NuxtLink>
            <NuxtLink 
              to="/auth/register"
              class="text-sm border border-green-600 text-green-600 px-3 py-1 rounded hover:bg-green-50 transition inline-block"
            >
              S'inscrire
            </NuxtLink>
          </div>
          
          <!-- User menu -->
          <div v-else class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              Bienvenue, {{ user.email || user.first_name || 'Utilisateur' }}
            </span>
            <button 
              @click="handleLogout"
              class="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Déconnexion
            </button>
          </div>
          
          <!-- Mobile menu removed - using bottom navigation instead -->
        </div>
      </div>

      <!-- Mobile Navigation removed - using bottom navigation instead -->
    </div>
  </header>
</template>

<script setup lang="ts">
// Use simplified auth composable for desktop header
const { user, logout } = useAuth()

// Simple logout action (mobile logout is handled in bottom navigation)
const handleLogout = async () => {
  await logout()
}
</script> 