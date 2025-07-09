/*
interface FarmerProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  phone?: string
  region: string
  district: string
  commune: string
  farmSize?: string
  crops: string[]
  avatar?: string
  bio?: string
  experience?: string
  interests: string[]
  isPublic: boolean
  socialLinks?: Record<string, string>
  preferences?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

interface FarmerStats {
  totalFarmers: number
  newFarmersThisMonth: number
  regionDistribution: Array<{
    region: string
    count: number
    percentage: number
  }>
  topCrops: Array<{
    crop: string
    count: number
  }>
  experienceDistribution: Array<{
    level: string
    count: number
  }>
}

export const useFarmerProfile = () => {
  const currentFarmerProfile = ref<FarmerProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Get current user's farmer profile
   */
  const getFarmerProfile = async (userId?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const endpoint = userId ? `/api/farmers/profile/${userId}` : '/api/farmers/profile/me'
      const { data } = await $fetch(endpoint)
      currentFarmerProfile.value = data.profile
      return data.profile
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch farmer profile'
      console.error('Error fetching farmer profile:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Update farmer profile
   */
  const updateFarmerProfile = async (updates: Partial<FarmerProfile>) => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch('/api/farmers/profile/me', {
        method: 'PATCH',
        body: updates
      })
      
      currentFarmerProfile.value = data.profile
      return data.profile
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to update farmer profile'
      console.error('Error updating farmer profile:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get farmers by region
   */
  const getFarmersByRegion = async (region: string, page = 1, limit = 20) => {
    try {
      const { data } = await $fetch(`/api/farmers/region/${region}`, {
        query: { page, limit }
      })
      return data
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch farmers by region'
      console.error('Error fetching farmers by region:', err)
      return null
    }
  }

  /**
   * Search farmers by crops
   */
  const searchFarmersByCrops = async (crops: string[], page = 1, limit = 20) => {
    try {
      const { data } = await $fetch('/api/farmers/search', {
        method: 'POST',
        body: { crops, page, limit }
      })
      return data
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to search farmers by crops'
      console.error('Error searching farmers by crops:', err)
      return null
    }
  }

  /**
   * Get farmer statistics for admin
   */
  const getFarmerStats = async (): Promise<FarmerStats | null> => {
    try {
      const { data } = await $fetch('/api/admin/farmers/stats')
      return data.stats
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch farmer statistics'
      console.error('Error fetching farmer stats:', err)
      return null
    }
  }

  /**
   * Connect farmers (farmer networking)
   */
  const connectWithFarmer = async (farmerId: string) => {
    try {
      const { data } = await $fetch('/api/farmers/connect', {
        method: 'POST',
        body: { farmerId }
      })
      return data.success
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to connect with farmer'
      console.error('Error connecting with farmer:', err)
      return false
    }
  }

  /**
   * Get farmer's crop recommendations based on region and experience
   */
  const getCropRecommendations = async (region: string, experience: string) => {
    try {
      const { data } = await $fetch('/api/farmers/recommendations/crops', {
        query: { region, experience }
      })
      return data.recommendations
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to get crop recommendations'
      console.error('Error fetching crop recommendations:', err)
      return []
    }
  }

  /**
   * Get seasonal farming calendar for farmer's region
   */
  const getSeasonalCalendar = async (region: string) => {
    try {
      const { data } = await $fetch('/api/farmers/calendar', {
        query: { region }
      })
      return data.calendar
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to get seasonal calendar'
      console.error('Error fetching seasonal calendar:', err)
      return null
    }
  }

  /**
   * Utility functions
   */
  const formatFarmSize = (size: string) => {
    const sizeMap: Record<string, string> = {
      '< 1 hectare': 'Petite exploitation (< 1 ha)',
      '1-5 hectares': 'Exploitation familiale (1-5 ha)',
      '5-20 hectares': 'Exploitation moyenne (5-20 ha)',
      '> 20 hectares': 'Grande exploitation (> 20 ha)'
    }
    return sizeMap[size] || size
  }

  const getExperienceLevel = (experience: string) => {
    const levelMap: Record<string, string> = {
      'Débutant': 'Nouvel agriculteur',
      'Intermédiaire': 'Agriculteur expérimenté',
      'Expérimenté': 'Agriculteur expert'
    }
    return levelMap[experience] || experience
  }

  const getMadagascarRegions = () => [
    'SAVA', 'Alaotra-Mangoro', 'Analamanga', 'Atsinanana', 'Boeny',
    'Diana', 'Haute Matsiatra', 'Ihorombe', 'Itasy', 'Melaky',
    'Menabe', 'Sofia', 'Vakinankaratra', 'Vatovavy Fitovinany'
  ]

  const getMadagascarCrops = () => [
    'Riz', 'Vanille', 'Girofle', 'Litchi', 'Café', 'Cacao',
    'Maïs', 'Manioc', 'Patate douce', 'Haricot', 'Arachide',
    'Canne à sucre', 'Ylang-ylang', 'Poivre', 'Cannelle'
  ]

  return {
    // State
    currentFarmerProfile: readonly(currentFarmerProfile),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    getFarmerProfile,
    updateFarmerProfile,
    getFarmersByRegion,
    searchFarmersByCrops,
    getFarmerStats,
    connectWithFarmer,
    getCropRecommendations,
    getSeasonalCalendar,

    // Utilities
    formatFarmSize,
    getExperienceLevel,
    getMadagascarRegions,
    getMadagascarCrops
  }
}
*/ 