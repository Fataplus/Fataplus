<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-green-600">🌱 Fataplus</h1>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Créer votre compte
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ou
          <NuxtLink 
            to="/auth/login"
            class="font-medium text-green-600 hover:text-green-500 transition"
          >
            connectez-vous à votre compte existant
          </NuxtLink>
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Error message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Erreur d'inscription
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>

          <!-- Success message -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Inscription réussie !
                </h3>
                <div class="mt-2 text-sm text-green-700">
                  Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.
                </div>
              </div>
            </div>
          </div>

          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <div class="mt-1">
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                autocomplete="given-name"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Jean"
              />
            </div>
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <div class="mt-1">
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                autocomplete="family-name"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Dupont"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="jean@example.com"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="new-password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Au moins 8 caractères avec une majuscule, une minuscule et un chiffre
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                autocomplete="new-password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Terms and conditions -->
          <div class="flex items-center">
            <input
              id="acceptTerms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label for="acceptTerms" class="ml-2 block text-sm text-gray-900">
              J'accepte les 
              <a href="#" class="font-medium text-green-600 hover:text-green-500 transition">
                conditions d'utilisation
              </a>
              et la
              <a href="#" class="font-medium text-green-600 hover:text-green-500 transition">
                politique de confidentialité
              </a>
            </label>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-green-500 group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </span>
              {{ isLoading ? 'Création...' : 'Créer mon compte' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use our simplified auth composable
const { register, isLoading } = useAuth()

// Form data
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

// State
const error = ref('')
const success = ref(false)

// Handle registration
const handleRegister = async () => {
  try {
    error.value = ''
    success.value = false
    
    // Basic validation
    if (form.password !== form.confirmPassword) {
      error.value = 'Les mots de passe ne correspondent pas'
      return
    }
    
    if (form.password.length < 8) {
      error.value = 'Le mot de passe doit contenir au moins 8 caractères'
      return
    }
    
    if (!form.acceptTerms) {
      error.value = 'Vous devez accepter les conditions d\'utilisation'
      return
    }
    
    await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password
    })
    
    success.value = true
    
    // Redirect to login after a delay
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 2000)
    
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue lors de l\'inscription'
  }
}

// Page meta
useHead({
  title: 'Inscription - Fataplus',
  meta: [
    { name: 'description', content: 'Créez votre compte Fataplus pour accéder à notre plateforme' }
  ]
})
</script> 