<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              <i class="ri-store-2-line mr-3 text-primary-600"></i>
              Marché Agricole
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Découvrez les meilleurs produits agricoles de Madagascar
            </p>
          </div>

          <!-- Search and Filter Actions -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher des produits..."
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <i
                class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Featured Products -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Produits en Vedette
        </h2>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <!-- Product Cards -->
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div
              class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg"
            >
              <img
                :src="
                  product.image ||
                  product.images?.[0] ||
                  '/images/placeholder-product.jpg'
                "
                :alt="product.name"
                class="h-48 w-full object-cover object-center group-hover:opacity-75"
              />
            </div>

            <div class="p-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ product.name }}
              </h3>

              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
              >
                {{ product.description }}
              </p>

              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-lg font-bold text-primary-600">
                    {{ formatPrice(product.price) }}
                  </span>
                </div>

                <div class="flex items-center space-x-2">
                  <span
                    :class="getStockClass(product.stock)"
                    class="text-sm font-medium"
                  >
                    {{ getStockLabel(product.stock) }}
                  </span>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex items-center">
                    <i class="ri-star-fill text-yellow-400 text-sm"></i>
                    <span class="ml-1 text-sm text-gray-600 dark:text-gray-300">
                      {{ product.rating }} ({{ product.reviewCount }})
                    </span>
                  </div>
                </div>

                <button
                  @click="addToCart(product)"
                  :disabled="product.stock === 0"
                  class="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <i class="ri-shopping-cart-line mr-1"></i>
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Catégories Populaires
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="category in popularCategories"
            :key="category.id"
            class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="text-3xl mb-2">{{ category.icon }}</div>
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProducts } from "~/modules/marketplace/composables/useProducts";

// Meta
definePageMeta({
  title: "Marché Agricole",
  description: "Découvrez les meilleurs produits agricoles de Madagascar",
});

// Composables
const { formatPrice, getStockLabel, getStockClass } = useProducts();
const { getFeaturedProducts, getProducts } = useFataplusContent();

// Reactive data
const searchQuery = ref("");

// Real data from Nuxt Content
const { data: featuredProducts } = await useLazyAsyncData(
  "featured-products",
  () => getFeaturedProducts(8)
);

// Popular categories - could also come from content later
const popularCategories = ref([
  { id: "1", name: "Céréales", icon: "🌾" },
  { id: "2", name: "Légumes", icon: "🥬" },
  { id: "3", name: "Fruits", icon: "🍓" },
  { id: "4", name: "Épices", icon: "🌶️" },
  { id: "5", name: "Légumineuses", icon: "🫘" },
  { id: "6", name: "Tubercules", icon: "🥔" },
]);

// Methods
const addToCart = (product: any) => {
  if (product.stock > 0) {
    console.log("Ajouté au panier:", product.name);
    // Here you would implement actual cart functionality
  }
};
</script>
