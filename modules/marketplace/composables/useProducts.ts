import { ref } from 'vue'
import type { Product, ProductFilter, ProductSearchParams } from '#types'

export const useProducts = () => {
  // Simple reactive state
  const products = ref([])
  const categories = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Simple product utilities
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mg-MG', {
      style: 'currency',
      currency: 'MGA'
    }).format(price)
  }
  
  const getStockLabel = (stock: number) => {
    if (stock > 10) return 'En stock'
    if (stock > 0) return 'Stock limité'
    return 'Rupture de stock'
  }
  
  const getStockClass = (stock: number) => {
    if (stock > 10) return 'text-green-600'
    if (stock > 0) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  return {
    products,
    categories,
    isLoading,
    error,
    formatPrice,
    getStockLabel,
    getStockClass
  }
} 