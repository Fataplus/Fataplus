<template>
  <div 
    class="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    :class="{ 'opacity-60': !isProductInStock(product) }"
  >
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <NuxtImg
        :src="getProductImageUrl(product, 'medium')"
        :alt="product.name"
        class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
        loading="lazy"
      />
      
      <!-- Stock Badge -->
      <div 
        v-if="!isProductInStock(product)"
        class="absolute top-2 left-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
      >
        {{ getStockLabel(product) }}
      </div>
      
      <!-- Rating Badge -->
      <div 
        v-if="product.rating > 0"
        class="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1"
      >
        <Icon name="heroicons:star-solid" class="h-3 w-3 text-yellow-400" />
        <span>{{ formatRating(product.rating) }}</span>
      </div>
      
      <!-- Quick Actions -->
      <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div class="flex space-x-2">
          <button
            @click.prevent="toggleWishlist"
            class="p-2 bg-white bg-opacity-90 hover:bg-white rounded-full shadow-sm transition-colors duration-200"
            :class="{ 'text-red-600': isInWishlist, 'text-gray-600': !isInWishlist }"
          >
            <Icon :name="isInWishlist ? 'heroicons:heart-solid' : 'heroicons:heart'" class="h-4 w-4" />
          </button>
          
          <button
            @click.prevent="quickView"
            class="p-2 bg-white bg-opacity-90 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <Icon name="heroicons:eye" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="p-4">
      <!-- Vendor -->
      <p class="text-xs text-gray-500 mb-1">{{ product.vendor.name }}</p>
      
      <!-- Product Name -->
      <h3 class="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
        <NuxtLink 
          :to="`/marketplace/products/${product.id}`"
          class="hover:text-green-600 transition-colors duration-200"
        >
          {{ product.name }}
        </NuxtLink>
      </h3>
      
      <!-- Category -->
      <p class="text-xs text-gray-500 mb-2">{{ product.category.name }}</p>
      
      <!-- Price -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <span class="text-lg font-bold text-gray-900">
            {{ formatPrice(product.price, product.currency) }}
          </span>
          <span v-if="product.currency === 'MGA'" class="text-xs text-gray-500">
            / {{ product.subcategory }}
          </span>
        </div>
      </div>
      
      <!-- Stock Status -->
      <div class="flex items-center justify-between mb-3">
        <span 
          class="text-xs font-medium"
          :class="getStockClass(product)"
        >
          {{ getStockLabel(product) }}
        </span>
        
        <!-- Reviews Count -->
        <span v-if="product.reviewCount > 0" class="text-xs text-gray-500">
          {{ product.reviewCount }} avis
        </span>
      </div>
      
      <!-- Add to Cart -->
      <button
        @click="addToCart"
        :disabled="!isProductInStock(product) || isAddingToCart"
        class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <Icon 
          v-if="isAddingToCart" 
          name="heroicons:arrow-path" 
          class="h-4 w-4 animate-spin" 
        />
        <Icon 
          v-else 
          name="heroicons:shopping-cart" 
          class="h-4 w-4" 
        />
        <span>
          {{ isAddingToCart ? 'Ajout...' : 'Ajouter au panier' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '#types'

interface Props {
  product: Product
}

const props = defineProps<Props>()

// Composables
const { 
  formatPrice, 
  formatRating, 
  getProductImageUrl, 
  isProductInStock, 
  getStockLabel, 
  getStockClass 
} = useProducts()
const cartStore = useCartStore()

// State
const isAddingToCart = ref(false)
const isInWishlist = ref(false) // TODO: Implement wishlist functionality

// Methods
const addToCart = async () => {
  if (!isProductInStock(props.product)) return
  
  isAddingToCart.value = true
  
  try {
    cartStore.addItem(props.product, 1)
    
    // Show success toast
    const toast = useToast()
    toast.add({
      title: 'Produit ajouté',
      description: `${props.product.name} a été ajouté à votre panier`,
      color: 'green',
      timeout: 3000,
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    
    // Show error toast
    const toast = useToast()
    toast.add({
      title: 'Erreur',
      description: 'Impossible d\'ajouter le produit au panier',
      color: 'red',
      timeout: 5000,
    })
  } finally {
    isAddingToCart.value = false
  }
}

const toggleWishlist = async () => {
  // TODO: Implement wishlist functionality
  isInWishlist.value = !isInWishlist.value
}

const quickView = () => {
  // TODO: Implement quick view modal
  console.log('Quick view:', props.product.id)
}

// Check if product is in wishlist on mount
onMounted(() => {
  // TODO: Check wishlist status
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 