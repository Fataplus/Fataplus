<template>
  <div>
    <!-- Dashboard Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        <i class="ri-dashboard-line mr-3 text-primary-600"></i>
        Tableau de Bord Admin
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">
        Vue d'ensemble de votre plateforme agricole Fataplus
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Orders -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <i class="ri-shopping-cart-line text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Commandes</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalOrders }}</p>
          </div>
        </div>
      </div>

      <!-- Total Products -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <i class="ri-box-line text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Produits</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalProducts }}</p>
          </div>
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <i class="ri-money-dollar-circle-line text-yellow-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Chiffre d'Affaires</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.totalRevenue) }}</p>
          </div>
        </div>
      </div>

      <!-- Active Users -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <i class="ri-user-line text-purple-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Utilisateurs Actifs</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.activeUsers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">
          Commandes Récentes
        </h2>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Commande
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Montant
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ order.customerName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatCurrency(order.total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatDate(order.date) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Set layout
definePageMeta({
  layout: 'admin',
  title: 'Admin Dashboard'
})

// Stats data
const stats = ref({
  totalOrders: 1247,
  totalProducts: 89,
  totalRevenue: 4567800,
  activeUsers: 342
})

// Recent orders data
const recentOrders = ref([
  {
    id: '1001',
    customerName: 'Rakoto Jean',
    total: 85000,
    status: 'Livré',
    date: new Date('2024-01-15')
  },
  {
    id: '1002',
    customerName: 'Rabe Marie',
    total: 45000,
    status: 'En cours',
    date: new Date('2024-01-14')
  },
  {
    id: '1003',
    customerName: 'Andry Pierre',
    total: 120000,
    status: 'Confirmé',
    date: new Date('2024-01-14')
  }
])

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('mg-MG', {
    style: 'currency',
    currency: 'MGA'
  }).format(amount).replace('MGA', 'Ar')
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR').format(date)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Livré':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'En cours':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Confirmé':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script> 