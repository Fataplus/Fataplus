<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4 bg-primary-600">
        <NuxtLink to="/admin" class="flex items-center">
          <span class="text-2xl">🌱</span>
          <span class="ml-2 text-xl font-bold text-white">Fataplus Admin</span>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-4">
        <div class="space-y-2">
          <NuxtLink
            to="/admin"
            class="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <i class="ri-dashboard-line mr-3"></i>
            Tableau de bord
          </NuxtLink>
          
          <NuxtLink
            to="/admin/products"
            class="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <i class="ri-box-line mr-3"></i>
            Produits
          </NuxtLink>
          
          <NuxtLink
            to="/admin/orders"
            class="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <i class="ri-shopping-cart-line mr-3"></i>
            Commandes
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 ml-64">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
              Administration
            </h1>
            
            <div class="flex items-center space-x-4">
              <NuxtLink 
                to="/"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <i class="ri-home-line mr-1"></i>
                Retour au site
              </NuxtLink>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// This layout is used for admin pages
</script> 