<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center text-3xl font-bold text-primary-600">
          <span class="text-4xl mr-2">🌱</span>
          Fataplus
        </NuxtLink>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Rejoignez la communauté agricole
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Connectez-vous avec les agriculteurs de Madagascar
        </p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white shadow-xl rounded-lg p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- User Type Selection -->
          <div class="text-center mb-6">
            <p class="text-lg font-medium text-gray-900 mb-4">Je suis :</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                @click="selectedRole = 'farmer'"
                :class="[
                  'p-4 border-2 rounded-lg transition-all duration-200',
                  selectedRole === 'farmer' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="text-3xl mb-2">🌾</div>
                <div class="font-semibold">Agriculteur</div>
                <div class="text-sm text-gray-500">Je cultive la terre</div>
              </button>
              
              <button
                type="button"
                @click="selectedRole = 'vendor'"
                :class="[
                  'p-4 border-2 rounded-lg transition-all duration-200',
                  selectedRole === 'vendor' 
                    ? 'border-orange-500 bg-orange-50 text-orange-700' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="text-3xl mb-2">🏪</div>
                <div class="font-semibold">Vendeur</div>
                <div class="text-sm text-gray-500">Je vends des produits</div>
              </button>
              
              <button
                type="button"
                @click="selectedRole = 'user'"
                :class="[
                  'p-4 border-2 rounded-lg transition-all duration-200',
                  selectedRole === 'user' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="text-3xl mb-2">👤</div>
                <div class="font-semibold">Acheteur</div>
                <div class="text-sm text-gray-500">Je recherche des produits</div>
              </button>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                Prénom *
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Votre prénom"
              >
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Votre nom de famille"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="votre@email.com"
              >
            </div>
            
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+261 XX XX XXX XX"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe *
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Au moins 8 caractères"
            >
          </div>

          <!-- Farmer-specific fields -->
          <div v-if="selectedRole === 'farmer'" class="space-y-6">
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                <i class="ri-map-pin-line mr-2"></i>
                Informations géographiques
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label for="region" class="block text-sm font-medium text-gray-700">
                    Région *
                  </label>
                  <select
                    id="region"
                    v-model="form.region"
                    required
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    @change="updateDistricts"
                  >
                    <option value="">Sélectionner une région</option>
                    <option v-for="region in madagascarRegions" :key="region.name" :value="region.name">
                      {{ region.name }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label for="district" class="block text-sm font-medium text-gray-700">
                    District *
                  </label>
                  <select
                    id="district"
                    v-model="form.district"
                    required
                    :disabled="!form.region"
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Sélectionner un district</option>
                    <option v-for="district in availableDistricts" :key="district" :value="district">
                      {{ district }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label for="commune" class="block text-sm font-medium text-gray-700">
                    Commune *
                  </label>
                  <input
                    id="commune"
                    v-model="form.commune"
                    type="text"
                    required
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Votre commune"
                  >
                </div>
              </div>
            </div>

            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                <i class="ri-plant-line mr-2"></i>
                Informations agricoles
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="farmSize" class="block text-sm font-medium text-gray-700">
                    Taille de l'exploitation
                  </label>
                  <select
                    id="farmSize"
                    v-model="form.farmSize"
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner la taille</option>
                    <option value="< 1 hectare">Moins de 1 hectare</option>
                    <option value="1-5 hectares">1 à 5 hectares</option>
                    <option value="5-20 hectares">5 à 20 hectares</option>
                    <option value="> 20 hectares">Plus de 20 hectares</option>
                  </select>
                </div>
                
                <div>
                  <label for="experience" class="block text-sm font-medium text-gray-700">
                    Expérience agricole
                  </label>
                  <select
                    id="experience"
                    v-model="form.experience"
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner l'expérience</option>
                    <option value="Débutant">Débutant (moins de 2 ans)</option>
                    <option value="Intermédiaire">Intermédiaire (2-10 ans)</option>
                    <option value="Expérimenté">Expérimenté (plus de 10 ans)</option>
                  </select>
                </div>
              </div>
              
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cultures principales
                </label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <label v-for="crop in madagascarCrops" :key="crop" class="flex items-center">
                    <input
                      type="checkbox"
                      :value="crop"
                      v-model="form.crops"
                      class="mr-2 text-primary-600 focus:ring-primary-500"
                    >
                    <span class="text-sm">{{ crop }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Terms and Submit -->
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                id="terms"
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="mr-2 text-primary-600 focus:ring-primary-500"
              >
              <label for="terms" class="text-sm text-gray-600">
                J'accepte les 
                <NuxtLink to="/legal/terms" class="text-primary-600 hover:text-primary-700">
                  conditions d'utilisation
                </NuxtLink>
                et la 
                <NuxtLink to="/legal/privacy" class="text-primary-600 hover:text-primary-700">
                  politique de confidentialité
                </NuxtLink>
              </label>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="loading" class="ri-loader-4-line animate-spin mr-2"></i>
              <i v-else class="ri-plant-line mr-2"></i>
              {{ loading ? 'Création du compte...' : 'Créer mon compte agriculteur' }}
            </button>

            <div class="text-center">
              <p class="text-sm text-gray-600">
                Déjà membre ?
                <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-700">
                  Se connecter
                </NuxtLink>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  layout: false
})

// Reactive data
const selectedRole = ref('farmer') // Default to farmer
const loading = ref(false)
const availableDistricts = ref([])

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  region: '',
  district: '',
  commune: '',
  farmSize: '',
  experience: '',
  crops: [],
  acceptTerms: false
})

// Madagascar regions and districts data
const madagascarRegions = ref([
  {
    name: 'SAVA',
    districts: ['Sambava', 'Antalaha', 'Vohemar', 'Andapa']
  },
  {
    name: 'Alaotra-Mangoro',
    districts: ['Ambatondrazaka', 'Amparafaravola', 'Andilamena', 'Anosibe An\'ala', 'Moramanga']
  },
  {
    name: 'Analamanga',
    districts: ['Antananarivo-Avaradrano', 'Antananarivo-Atsimondrano', 'Antananarivo-Renivohitra', 'Ambohidratrimo', 'Ankazobe', 'Anjozorobe']
  },
  {
    name: 'Atsinanana',
    districts: ['Tamatave I', 'Tamatave II', 'Brickaville', 'Fenerive Est', 'Mahanoro', 'Marolambo', 'Vatomandry']
  },
  {
    name: 'Boeny',
    districts: ['Mahajanga I', 'Mahajanga II', 'Ambato-Boeny', 'Kandreho', 'Marovoay', 'Mitsinjo', 'Soalala']
  }
])

// Madagascar major crops
const madagascarCrops = ref([
  'Riz', 'Vanille', 'Girofle', 'Litchi', 'Café', 'Cacao',
  'Maïs', 'Manioc', 'Patate douce', 'Haricot', 'Arachide',
  'Canne à sucre', 'Ylang-ylang', 'Poivre', 'Cannelle'
])

// Update districts when region changes
const updateDistricts = () => {
  const selectedRegion = madagascarRegions.value.find(r => r.name === form.value.region)
  availableDistricts.value = selectedRegion ? selectedRegion.districts : []
  form.value.district = '' // Reset district selection
}

// Handle registration
const handleRegister = async () => {
  loading.value = true
  
  try {
    const registrationData = {
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
      role: selectedRole.value
    }

    // Add farmer-specific data
    if (selectedRole.value === 'farmer') {
      Object.assign(registrationData, {
        region: form.value.region,
        district: form.value.district,
        commune: form.value.commune,
        farmSize: form.value.farmSize,
        experience: form.value.experience,
        crops: form.value.crops,
        interests: form.value.crops // Use crops as interests for now
      })
    }

    const { data } = await $fetch('/api/auth/register', {
      method: 'POST',
      body: registrationData
    })

    if (data.success) {
      // Show success message
      alert(data.message || 'Compte créé avec succès!')
      
      // Redirect based on role
      if (selectedRole.value === 'farmer') {
        navigateTo('/auth/login?message=farmer-welcome')
      } else {
        navigateTo('/auth/login?message=success')
      }
    }
    
  } catch (error: any) {
    console.error('Registration failed:', error)
    alert(error.data?.message || 'Erreur lors de la création du compte')
  } finally {
    loading.value = false
  }
}
</script> 