<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              <i class="ri-box-line mr-3 text-primary-600"></i>
              Gestion des Produits GroFresh
            </h1>
            <p class="text-gray-600 dark:text-gray-300 mt-1">
              Gérez votre catalogue de produits agricoles
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg">
              <i class="ri-add-line mr-2"></i>
              Ajouter un Produit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rechercher</label>
            <input type="text" v-model="searchQuery" placeholder="Nom du produit..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catégorie</label>
            <select v-model="selectedCategory"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="">Toutes les catégories</option>
              <option value="cereales">Céréales</option>
              <option value="legumes">Légumes</option>
              <option value="fruits">Fruits</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
            <select v-model="selectedStatus"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="resetFilters" class="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Produits ({{ filteredProducts.length }})
          </h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Produit
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Catégorie
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prix
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="product in paginatedProducts" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img :src="product.image" :alt="product.name" class="w-10 h-10 rounded object-cover">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">ID: {{ product.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ product.category }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatCurrency(product.price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStockClass(product.stock)" class="text-sm">
                    {{ product.stock }} unités
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(product.status)" class="text-xs px-2 py-1 rounded">
                    {{ product.status === 'active' ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-900">
                      <i class="ri-edit-line"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900">
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Affichage {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} 
              sur {{ filteredProducts.length }} produits
            </p>
            <div class="flex space-x-2">
              <button @click="prevPage" :disabled="currentPage === 1" 
                class="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-800 disabled:opacity-50">
                Précédent
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-800 disabled:opacity-50">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Mock data - would come from API in real implementation
const products = ref([
  {
    id: 'P001',
    name: 'Riz Rouge de Lac Alaotra',
    category: 'Céréales',
    price: 8500,
    stock: 150,
    status: 'active',
    image: '/images/riz-rouge.jpg'
  },
  {
    id: 'P002', 
    name: 'Vanille de Sambava',
    category: 'Épices',
    price: 125000,
    stock: 25,
    status: 'active',
    image: '/images/vanille.jpg'
  },
  // Add more mock products here
])

// Reactive search and filter state
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed properties
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    const matchesStatus = !selectedStatus.value || product.status === selectedStatus.value
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStockClass = (stock) => {
  if (stock < 10) return 'text-red-600'
  if (stock < 50) return 'text-yellow-600'
  return 'text-green-600'
}

const getStatusClass = (status) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Page meta
useHead({
  title: 'Gestion des Produits - Admin Fataplus',
  meta: [
    { name: 'description', content: 'Interface d\'administration pour la gestion des produits agricoles' }
  ]
})
</script> 