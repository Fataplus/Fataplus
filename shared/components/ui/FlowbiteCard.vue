<template>
  <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
    <!-- Image Section -->
    <div v-if="image" class="relative">
      <img 
        :src="image" 
        :alt="title"
        class="w-full h-48 object-cover rounded-t-lg"
      />
      <div v-if="badge" class="absolute top-3 left-3">
        <span class="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300">
          {{ badge }}
        </span>
      </div>
      <div v-if="price" class="absolute top-3 right-3">
        <span class="bg-white text-gray-900 text-sm font-semibold px-3 py-1 rounded-lg shadow-sm">
          {{ price }}
        </span>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-5">
      <!-- Category -->
      <div v-if="category" class="mb-2">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
          {{ category }}
        </span>
      </div>

      <!-- Title -->
      <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
        {{ title }}
      </h5>

      <!-- Description -->
      <p v-if="description" class="mb-3 text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
        {{ description }}
      </p>

      <!-- Rating (if provided) -->
      <div v-if="rating" class="flex items-center mb-3">
        <div class="flex items-center space-x-1">
          <svg 
            v-for="star in 5" 
            :key="star"
            class="w-4 h-4"
            :class="star <= rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-600'"
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor" 
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
          </svg>
        </div>
        <span class="bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 ml-3">
          {{ rating }}.0
        </span>
      </div>

      <!-- Tags/Features -->
      <div v-if="tags && tags.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="tag in tags.slice(0, 3)" 
            :key="tag"
            class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300"
          >
            {{ tag }}
          </span>
          <span v-if="tags.length > 3" class="text-xs text-gray-500 dark:text-gray-400">
            +{{ tags.length - 3 }} plus
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col space-y-2">
        <button 
          type="button" 
          class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-colors duration-200"
          @click="$emit('primary-action')"
        >
          <i class="ri-add-line mr-2"></i>
          {{ primaryActionText || 'Ajouter au panier' }}
        </button>
        
        <button 
          v-if="secondaryActionText"
          type="button" 
          class="w-full text-primary-600 hover:text-white border border-primary-600 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-600 dark:focus:ring-primary-800 transition-colors duration-200"
          @click="$emit('secondary-action')"
        >
          <i class="ri-heart-line mr-2"></i>
          {{ secondaryActionText }}
        </button>
      </div>

      <!-- Additional Info -->
      <div v-if="location || seller" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span v-if="location" class="flex items-center">
            <i class="ri-map-pin-line mr-1"></i>
            {{ location }}
          </span>
          <span v-if="seller" class="flex items-center">
            <i class="ri-user-line mr-1"></i>
            {{ seller }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props interface for type safety
interface Props {
  title: string
  description?: string
  image?: string
  category?: string
  badge?: string
  price?: string
  rating?: number
  tags?: string[]
  location?: string
  seller?: string
  primaryActionText?: string
  secondaryActionText?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  primaryActionText: 'Ajouter au panier',
  secondaryActionText: ''
})

// Define emits for component events
const emit = defineEmits<{
  'primary-action': []
  'secondary-action': []
}>()
</script>

<style scoped>
/* Custom line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for hover effects */
.transition-shadow {
  transition: box-shadow 0.3s ease;
}
</style> 