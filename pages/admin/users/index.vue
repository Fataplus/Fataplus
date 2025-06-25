<template>
  <div>
    <NuxtLayout name="admin">
      <div class="space-y-6">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                <i class="ri-team-line mr-2"></i>
                Gestion des Utilisateurs
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Gérez les rôles et permissions des utilisateurs
              </p>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Total: {{ pagination?.total || 0 }} utilisateurs
              </div>
            </div>
          </div>
        </div>

        <!-- Filters & Search -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rechercher
              </label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Nom, email..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                @input="debouncedSearch"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rôle
              </label>
              <select
                v-model="selectedRole"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                @change="fetchUsers"
              >
                <option value="">Tous les rôles</option>
                <option value="farmer">Agriculteurs</option>
                <option value="vendor">Vendeurs</option>
                <option value="user">Utilisateurs</option>
                <option value="admin">Administrateurs</option>
                <option value="superadmin" v-if="currentUser?.role === 'superadmin'">SuperAdmins</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut
              </label>
              <select
                v-model="selectedStatus"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                @change="fetchUsers"
              >
                <option value="">Tous les statuts</option>
                <option value="verified">Vérifiés</option>
                <option value="unverified">Non vérifiés</option>
              </select>
            </div>
            
            <div class="flex items-end">
              <button
                @click="resetFilters"
                class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <i class="ri-refresh-line mr-1"></i>
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Role Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div 
            v-for="stat in roleStats" 
            :key="stat.role"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ getRoleLabel(stat.role) }}
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ stat.count }}
                </p>
              </div>
              <div class="text-right">
                <div :class="getRoleColor(stat.role)" class="w-12 h-12 rounded-lg flex items-center justify-center">
                  <i :class="getRoleIcon(stat.role)" class="text-xl text-white"></i>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ stat.percentage }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Liste des Utilisateurs
            </h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                          <span class="text-sm font-medium text-white">
                            {{ user.first_name?.charAt(0) || user.name?.charAt(0) || '?' }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ user.first_name }} {{ user.last_name || user.name }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ user.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getRoleBadgeClass(user.role)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      <i :class="getRoleIcon(user.role)" class="mr-1"></i>
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="user.email_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      <i :class="user.email_verified ? 'ri-shield-check-line' : 'ri-shield-line'" class="mr-1"></i>
                      {{ user.email_verified ? 'Vérifié' : 'Non vérifié' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatLastLogin(user.last_login_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <!-- Role Change Dropdown -->
                      <select
                        v-if="canManageUser(user)"
                        :value="user.role"
                        @change="changeUserRole(user, $event.target.value)"
                        class="text-sm border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="farmer">Agriculteur</option>
                        <option value="vendor">Vendeur</option>
                        <option value="admin" v-if="currentUser?.role === 'superadmin'">Admin</option>
                        <option value="superadmin" v-if="currentUser?.role === 'superadmin'">SuperAdmin</option>
                      </select>
                      
                      <button
                        v-if="canViewProfile(user)"
                        @click="viewProfile(user)"
                        class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        title="Voir le profil"
                      >
                        <i class="ri-eye-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div v-if="pagination" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                Affichage {{ ((pagination.page - 1) * pagination.limit) + 1 }} à {{ Math.min(pagination.page * pagination.limit, pagination.total) }} sur {{ pagination.total }} utilisateurs
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page <= 1"
                  class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Précédent
                </button>
                <span class="px-3 py-1 text-sm">
                  Page {{ pagination.page }} sur {{ pagination.totalPages }}
                </span>
                <button
                  @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.totalPages"
                  class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Admin route protection
definePageMeta({
  middleware: 'admin'
})

// Reactive data
const users = ref([])
const roleStats = ref([])
const pagination = ref(null)
const loading = ref(false)

// Filters
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)

// Current user info
const currentUser = useState('admin.user')

// Fetch users data
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: '20'
    })
    
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (selectedRole.value) params.append('role', selectedRole.value)
    
    const { data } = await $fetch(`/api/admin/users?${params}`)
    users.value = data.users
    pagination.value = data.pagination
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

// Fetch role statistics
const fetchRoleStats = async () => {
  try {
    const { data } = await $fetch('/api/admin/system/roles')
    roleStats.value = data.roleDistribution
  } catch (error) {
    console.error('Failed to fetch role stats:', error)
  }
}

// Debounced search
const debouncedSearch = debounce(fetchUsers, 300)

// Change user role
const changeUserRole = async (user: any, newRole: string) => {
  if (user.role === newRole) return
  
  const confirmed = confirm(`Êtes-vous sûr de vouloir changer le rôle de ${user.first_name} ${user.last_name} vers ${getRoleLabel(newRole)}?`)
  if (!confirmed) return
  
  try {
    await $fetch(`/api/admin/users/${user.id}/role`, {
      method: 'PATCH',
      body: { newRole }
    })
    
    // Update local data
    user.role = newRole
    await fetchRoleStats()
    
    // Show success message
    alert(`Rôle mis à jour avec succès!`)
  } catch (error: any) {
    alert(`Erreur: ${error.data?.message || 'Impossible de changer le rôle'}`)
    console.error('Failed to change role:', error)
  }
}

// Permission checks
const canManageUser = (user: any) => {
  if (!currentUser.value) return false
  
  const currentUserRole = currentUser.value.role
  const targetRole = user.role
  
  // SuperAdmin can manage everyone
  if (currentUserRole === 'superadmin') return true
  
  // Admin can manage everyone except superadmin
  if (currentUserRole === 'admin' && targetRole !== 'superadmin') return true
  
  return false
}

const canViewProfile = (user: any) => {
  return ['admin', 'superadmin'].includes(currentUser.value?.role)
}

// Utility functions
const getRoleLabel = (role: string) => {
  const labels = {
    superadmin: 'SuperAdmin',
    admin: 'Administrateur',
    farmer: 'Agriculteur',
    vendor: 'Vendeur',
    user: 'Utilisateur'
  }
  return labels[role] || role
}

const getRoleIcon = (role: string) => {
  const icons = {
    superadmin: 'ri-vip-crown-line',
    admin: 'ri-shield-star-line',
    farmer: 'ri-plant-line',
    vendor: 'ri-store-line',
    user: 'ri-user-line'
  }
  return icons[role] || 'ri-user-line'
}

const getRoleColor = (role: string) => {
  const colors = {
    superadmin: 'bg-purple-500',
    admin: 'bg-blue-500',
    farmer: 'bg-green-500',
    vendor: 'bg-orange-500',
    user: 'bg-gray-500'
  }
  return colors[role] || 'bg-gray-500'
}

const getRoleBadgeClass = (role: string) => {
  const classes = {
    superadmin: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    farmer: 'bg-green-100 text-green-800',
    vendor: 'bg-orange-100 text-orange-800',
    user: 'bg-gray-100 text-gray-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const formatLastLogin = (timestamp: number) => {
  if (!timestamp) return 'Jamais'
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedRole.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  fetchUsers()
}

const viewProfile = (user: any) => {
  // Navigate to user profile page
  navigateTo(`/admin/users/${user.id}`)
}

// Simple debounce function
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Initialize data
onMounted(() => {
  fetchUsers()
  fetchRoleStats()
})
</script> 