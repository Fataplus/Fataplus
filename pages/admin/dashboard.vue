<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Admin Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              <i class="ri-dashboard-line mr-3 text-primary-600"></i>
              Tableau de Bord Admin - GroFresh Style
            </h1>
            <p class="text-gray-600 dark:text-gray-300 mt-1">
              Gestion complète de la plateforme agricole Fataplus
            </p>
          </div>
          
          <!-- Quick Stats -->
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ formatNumber(totalOrders) }}</div>
              <div class="text-sm text-gray-600">Commandes</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(totalRevenue) }}</div>
              <div class="text-sm text-gray-600">Revenus</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">{{ totalProducts }}</div>
              <div class="text-sm text-gray-600">Produits</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <i class="ri-shopping-cart-line text-green-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ totalOrders }}</h3>
              <p class="text-gray-600 dark:text-gray-300">Total Commandes</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <i class="ri-money-dollar-circle-line text-blue-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatCurrency(totalRevenue) }}</h3>
              <p class="text-gray-600 dark:text-gray-300">Revenus Totaux</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <i class="ri-box-line text-orange-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ totalProducts }}</h3>
              <p class="text-gray-600 dark:text-gray-300">Produits</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <i class="ri-user-line text-purple-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ totalCustomers }}</h3>
              <p class="text-gray-600 dark:text-gray-300">Clients</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Sales Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <i class="ri-line-chart-line mr-2"></i>
            Évolution des Ventes
          </h3>
          <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
            <p class="text-gray-500">Graphique des ventes (Chart.js integration)</p>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <i class="ri-shopping-bag-line mr-2"></i>
            Commandes Récentes
          </h3>
          <div class="space-y-3">
            <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">#{{ order.id }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ order.customer }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(order.total) }}</p>
                <span :class="getStatusClass(order.status)" class="text-xs px-2 py-1 rounded">
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          <i class="ri-rocket-line mr-2"></i>
          Actions Rapides
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <NuxtLink to="/admin/products" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
            <i class="ri-box-line text-2xl text-primary-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Produits</span>
          </NuxtLink>
          
          <NuxtLink to="/admin/orders" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
            <i class="ri-shopping-cart-line text-2xl text-primary-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Commandes</span>
          </NuxtLink>
          
          <NuxtLink to="/admin/customers" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
            <i class="ri-user-line text-2xl text-primary-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Clients</span>
          </NuxtLink>
          
          <NuxtLink to="/admin/vendors" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
            <i class="ri-store-line text-2xl text-primary-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Vendeurs</span>
          </NuxtLink>
          
          <NuxtLink to="/admin/analytics" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
            <i class="ri-bar-chart-line text-2xl text-primary-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Analytics</span>
          </NuxtLink>
          
          <NuxtLink to="/admin/settings" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
            <i class="ri-settings-line text-2xl text-primary-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Paramètres</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Mock data - in real app this would come from API
const totalOrders = ref(1247)
const totalRevenue = ref(45890000) // in Ariary
const totalProducts = ref(342)
const totalCustomers = ref(856)

const recentOrders = ref([
  { id: '1247', customer: 'Jean Rakoto', total: 125000, status: 'pending' },
  { id: '1246', customer: 'Marie Rasoa', total: 89000, status: 'confirmed' },
  { id: '1245', customer: 'Paul Andry', total: 156000, status: 'delivered' },
  { id: '1244', customer: 'Sophie Hery', total: 78000, status: 'cancelled' },
])

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Page meta
useHead({
  title: 'Admin Dashboard - Fataplus',
  meta: [
    { name: 'description', content: 'Tableau de bord administrateur pour la plateforme agricole Fataplus' }
  ]
})
</script> 