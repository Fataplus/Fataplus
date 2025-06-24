import type { Product, ProductFilter, ProductSearchParams } from '#types'

export const useProducts = () => {
  const productsStore = useProductsStore()
  
  // Reactive state
  const products = computed(() => productsStore.products)
  const categories = computed(() => productsStore.categories)
  const isLoading = computed(() => productsStore.isLoading)
  const error = computed(() => productsStore.error)
  const pagination = computed(() => productsStore.pagination)
  const featuredProducts = computed(() => productsStore.featuredProducts)
  
  // Search and filtering
  const searchProducts = async (query: string, filters?: ProductFilter) => {
    await productsStore.searchProducts(query, filters)
  }
  
  const applyFilters = (filters: ProductFilter) => {
    productsStore.setFilters(filters)
    return productsStore.fetchProducts()
  }
  
  const clearFilters = () => {
    productsStore.clearFilters()
    return productsStore.fetchProducts()
  }
  
  // Product operations
  const fetchProducts = (params?: ProductSearchParams) => {
    return productsStore.fetchProducts(params)
  }
  
  const fetchProductById = (id: string) => {
    return productsStore.fetchProductById(id)
  }
  
  const loadMore = () => {
    return productsStore.loadMore()
  }
  
  // Categories
  const fetchCategories = () => {
    return productsStore.fetchCategories()
  }
  
  const selectCategory = (category: any) => {
    productsStore.setCategory(category)
    return productsStore.fetchProducts()
  }
  
  // Utility functions
  const getProductById = (id: string) => {
    return productsStore.getProductById(id)
  }
  
  const getProductsByCategory = (categoryId: string) => {
    return productsStore.productsByCategory(categoryId)
  }
  
  const formatPrice = (price: number, currency: 'MGA' | 'EUR' = 'MGA') => {
    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'MGA' ? 0 : 2,
    })
    return formatter.format(price)
  }
  
  const formatRating = (rating: number) => {
    return Math.round(rating * 10) / 10
  }
  
  const getProductImageUrl = (product: Product, size: 'thumb' | 'medium' | 'large' = 'medium') => {
    if (!product.images || product.images.length === 0) {
      return `/images/product-placeholder-${size}.jpg`
    }
    
    const baseUrl = product.images[0]
    // Transform URL based on size if using a CDN like Cloudinary
    return baseUrl.replace('/upload/', `/upload/c_fill,w_${getSizeWidth(size)},h_${getSizeHeight(size)}/`)
  }
  
  const getSizeWidth = (size: string) => {
    switch (size) {
      case 'thumb': return 150
      case 'medium': return 300
      case 'large': return 600
      default: return 300
    }
  }
  
  const getSizeHeight = (size: string) => {
    switch (size) {
      case 'thumb': return 150
      case 'medium': return 300
      case 'large': return 400
      default: return 300
    }
  }
  
  const isProductInStock = (product: Product) => {
    return product.stock > 0 && product.isActive
  }
  
  const getStockLabel = (product: Product) => {
    if (!product.isActive) return 'Unavailable'
    if (product.stock === 0) return 'Out of stock'
    if (product.stock < 5) return 'Low stock'
    return 'In stock'
  }
  
  const getStockClass = (product: Product) => {
    if (!product.isActive || product.stock === 0) return 'text-red-600'
    if (product.stock < 5) return 'text-yellow-600'
    return 'text-green-600'
  }
  
  // Product recommendations
  const getRelatedProducts = async (productId: string, limit: number = 4) => {
    try {
      const relatedProducts = await $fetch<Product[]>(`/api/marketplace/products/${productId}/related`, {
        params: { limit },
      })
      return relatedProducts
    } catch (error) {
      console.error('Error fetching related products:', error)
      return []
    }
  }
  
  const getRecommendedProducts = async (userId?: string, limit: number = 6) => {
    try {
      const params = userId ? { userId, limit } : { limit }
      const recommendedProducts = await $fetch<Product[]>('/api/marketplace/products/recommended', {
        params,
      })
      return recommendedProducts
    } catch (error) {
      console.error('Error fetching recommended products:', error)
      return featuredProducts.value.slice(0, limit)
    }
  }
  
  // Initialize store if not already loaded
  const initialize = async () => {
    if (categories.value.length === 0) {
      await fetchCategories()
    }
    if (products.value.length === 0) {
      await fetchProducts()
    }
  }
  
  return {
    // State
    products,
    categories,
    isLoading,
    error,
    pagination,
    featuredProducts,
    
    // Actions
    searchProducts,
    applyFilters,
    clearFilters,
    fetchProducts,
    fetchProductById,
    fetchCategories,
    selectCategory,
    loadMore,
    
    // Getters
    getProductById,
    getProductsByCategory,
    
    // Utilities
    formatPrice,
    formatRating,
    getProductImageUrl,
    isProductInStock,
    getStockLabel,
    getStockClass,
    getRelatedProducts,
    getRecommendedProducts,
    
    // Initialize
    initialize,
  }
} 