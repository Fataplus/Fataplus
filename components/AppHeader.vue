<template>
  <header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <!-- Top bar avec notifications importantes -->
      <div v-if="showTopBanner" class="bg-green-600 text-white text-sm py-2 px-4 text-center relative">
        <span>🎉 Nouvelle fonctionnalité : Assistant IA personnalisé maintenant disponible !</span>
        <button 
          @click="showTopBanner = false"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 hover:text-gray-200"
        >
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>
      
      <!-- Navigation principale -->
      <nav class="flex items-center justify-between py-4">
        <!-- Logo et navigation -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <img src="/images/logo.svg" alt="Fataplus" class="h-8 w-auto" />
            <span class="text-2xl font-bold text-green-600 dark:text-green-400">Fataplus</span>
          </NuxtLink>
          
          <!-- Navigation desktop -->
          <div class="hidden lg:flex items-center space-x-8">
            <UDropdown :items="marketplaceMenu" class="relative">
              <template #default="{ open }">
                <UButton 
                  variant="ghost" 
                  class="flex items-center space-x-1"
                  :class="{ 'text-green-600': open }"
                >
                  <Icon name="heroicons:shopping-bag" class="w-5 h-5" />
                  <span>Marché</span>
                  <Icon name="heroicons:chevron-down" class="w-4 h-4" />
                </UButton>
              </template>
            </UDropdown>
            
            <UDropdown :items="learningMenu" class="relative">
              <template #default="{ open }">
                <UButton 
                  variant="ghost" 
                  class="flex items-center space-x-1"
                  :class="{ 'text-green-600': open }"
                >
                  <Icon name="heroicons:academic-cap" class="w-5 h-5" />
                  <span>Formation</span>
                  <Icon name="heroicons:chevron-down" class="w-4 h-4" />
                </UButton>
              </template>
            </UDropdown>
            
            <UButton 
              variant="ghost" 
              @click="navigateTo('/community')"
              class="flex items-center space-x-1"
            >
              <Icon name="heroicons:users" class="w-5 h-5" />
              <span>Communauté</span>
            </UButton>
            
            <UButton 
              variant="ghost" 
              @click="toggleAIAssistant"
              class="flex items-center space-x-1"
            >
              <Icon name="heroicons:sparkles" class="w-5 h-5" />
              <span>IA Assistant</span>
            </UButton>
          </div>
        </div>
        
        <!-- Barre de recherche -->
        <div class="hidden md:flex flex-1 max-w-xl mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher des produits, formations..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              @keyup.enter="performSearch"
            />
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            
            <!-- Suggestions de recherche -->
            <div v-if="showSearchSuggestions && searchSuggestions.length" 
                 class="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 z-50">
              <div class="py-2">
                <div v-for="suggestion in searchSuggestions" :key="suggestion.id" 
                     @click="selectSuggestion(suggestion)"
                     class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center space-x-3">
                  <Icon :name="suggestion.type === 'product' ? 'heroicons:shopping-bag' : 'heroicons:academic-cap'" class="w-4 h-4 text-gray-400" />
                  <span>{{ suggestion.title }}</span>
                  <span class="text-xs text-gray-500 ml-auto">{{ suggestion.type === 'product' ? 'Produit' : 'Formation' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Actions utilisateur -->
        <div class="flex items-center space-x-4">
          <!-- Mode sombre -->
          <UButton 
            variant="ghost" 
            size="sm"
            @click="toggleColorMode"
            class="p-2"
          >
            <Icon :name="$colorMode.preference === 'dark' ? 'heroicons:sun' : 'heroicons:moon'" class="w-5 h-5" />
          </UButton>
          
          <!-- Sélecteur de langue -->
          <UDropdown :items="languageMenu">
            <template #default>
              <UButton variant="ghost" size="sm" class="p-2">
                <span class="text-sm font-medium">{{ $i18n.locale.toUpperCase() }}</span>
                <Icon name="heroicons:chevron-down" class="w-4 h-4 ml-1" />
              </UButton>
            </template>
          </UDropdown>
          
          <!-- Notifications -->
          <div v-if="user" class="relative">
            <UButton 
              variant="ghost" 
              size="sm"
              @click="toggleNotifications"
              class="p-2 relative"
            >
              <Icon name="heroicons:bell" class="w-5 h-5" />
              <span v-if="unreadNotifications > 0" 
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ unreadNotifications > 99 ? '99+' : unreadNotifications }}
              </span>
            </UButton>
            
            <!-- Panel notifications -->
            <NotificationPanel v-if="showNotifications" @close="showNotifications = false" />
          </div>
          
          <!-- Panier -->
          <div class="relative">
            <UButton 
              variant="ghost" 
              size="sm"
              @click="toggleCart"
              class="p-2 relative"
            >
              <Icon name="heroicons:shopping-cart" class="w-5 h-5" />
              <span v-if="cartItemsCount > 0" 
                    class="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ cartItemsCount }}
              </span>
            </UButton>
          </div>
          
          <!-- Menu utilisateur -->
          <div v-if="user" class="relative">
            <UDropdown :items="userMenu">
              <template #default>
                <UButton variant="ghost" class="flex items-center space-x-2">
                  <UAvatar 
                    :src="user.avatar" 
                    :alt="user.firstName + ' ' + user.lastName"
                    size="sm"
                  />
                  <span class="hidden md:block text-sm font-medium">{{ user.firstName }}</span>
                  <Icon name="heroicons:chevron-down" class="w-4 h-4" />
                </UButton>
              </template>
            </UDropdown>
          </div>
          
          <!-- Boutons d'authentification -->
          <div v-else class="flex items-center space-x-2">
            <UButton 
              variant="ghost" 
              @click="navigateTo('/auth/login')"
              size="sm"
            >
              Connexion
            </UButton>
            <UButton 
              color="primary" 
              @click="navigateTo('/auth/register')"
              size="sm"
            >
              S'inscrire
            </UButton>
          </div>
          
          <!-- Menu mobile -->
          <UButton 
            variant="ghost" 
            @click="toggleMobileMenu"
            class="lg:hidden p-2"
          >
            <Icon name="heroicons:bars-3" class="w-6 h-6" />
          </UButton>
        </div>
      </nav>
    </div>
    
    <!-- Menu mobile -->
    <MobileMenu v-if="showMobileMenu" @close="showMobileMenu = false" />
  </header>
</template>

<script setup lang="ts">
// Stores
const { user } = useAuthStore()
const { toggleCart, cartItemsCount } = useCartStore()
const { toggleAIAssistant } = useUIStore()
const { unreadNotifications } = useNotificationStore()

// État local
const showTopBanner = ref(true)
const searchQuery = ref('')
const showSearchSuggestions = ref(false)
const searchSuggestions = ref([])
const showNotifications = ref(false)
const showMobileMenu = ref(false)

// Watchers pour la recherche
watch(searchQuery, async (newQuery) => {
  if (newQuery.length > 2) {
    const { data } = await $fetch('/api/search/suggestions', {
      query: { q: newQuery }
    })
    searchSuggestions.value = data
    showSearchSuggestions.value = true
  } else {
    showSearchSuggestions.value = false
  }
})

// Menus de navigation
const marketplaceMenu = [
  [
    { label: 'Tous les produits', to: '/marketplace' },
    { label: 'Fruits & Légumes', to: '/marketplace/category/fruits-legumes' },
    { label: 'Céréales', to: '/marketplace/category/cereales' },
    { label: 'Produits Bio', to: '/marketplace/category/bio' }
  ],
  [
    { label: 'Vendre mes produits', to: '/seller/dashboard' },
    { label: 'Devenir vendeur', to: '/seller/register' }
  ]
]

const learningMenu = [
  [
    { label: 'Tous les cours', to: '/learning' },
    { label: 'Agriculture durable', to: '/learning/category/agriculture-durable' },
    { label: 'Élevage', to: '/learning/category/elevage' },
    { label: 'Transformation', to: '/learning/category/transformation' }
  ],
  [
    { label: 'Mes formations', to: '/learning/my-courses' },
    { label: 'Certificats', to: '/learning/certificates' },
    { label: 'Créer un cours', to: '/learning/create' }
  ]
]

const languageMenu = [
  [
    { 
      label: 'Français', 
      click: () => switchLocalePath('fr'),
      icon: 'emojione:flag-for-france'
    },
    { 
      label: 'Malagasy', 
      click: () => switchLocalePath('mg'),
      icon: 'emojione:flag-for-madagascar'
    }
  ]
]

const userMenu = computed(() => [
  [
    { label: 'Mon profil', to: '/profile', icon: 'heroicons:user' },
    { label: 'Mes commandes', to: '/orders', icon: 'heroicons:shopping-bag' },
    { label: 'Mes formations', to: '/learning/my-courses', icon: 'heroicons:academic-cap' },
    { label: 'Mes favoris', to: '/favorites', icon: 'heroicons:heart' }
  ],
  [
    { label: 'Paramètres', to: '/settings', icon: 'heroicons:cog-6-tooth' },
    { label: 'Aide', to: '/help', icon: 'heroicons:question-mark-circle' }
  ],
  [
    { 
      label: 'Déconnexion', 
      click: logout,
      icon: 'heroicons:arrow-right-on-rectangle'
    }
  ]
])

// Méthodes
const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    showSearchSuggestions.value = false
  }
}

const selectSuggestion = (suggestion: any) => {
  if (suggestion.type === 'product') {
    navigateTo(`/marketplace/product/${suggestion.slug}`)
  } else if (suggestion.type === 'course') {
    navigateTo(`/learning/course/${suggestion.slug}`)
  }
  showSearchSuggestions.value = false
  searchQuery.value = ''
}

const toggleColorMode = () => {
  const { $colorMode } = useNuxtApp()
  $colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const { logout } = useAuthStore()

// Fermer les dropdowns au clic extérieur
onClickOutside(template, () => {
  showSearchSuggestions.value = false
  showNotifications.value = false
})
</script> 