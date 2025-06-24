import { defineStore } from 'pinia'
import type { 
  Product, 
  ProductCategory, 
  ProductFilter, 
  ProductSearchParams,
  PaginatedResponse 
} from '#types'

interface ProductsState {
  products: Product[]
  categories: ProductCategory[]
  selectedCategory: ProductCategory | null
  filters: ProductFilter
  searchParams: ProductSearchParams
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    categories: [],
    selectedCategory: null,
    filters: {},
    searchParams: {},
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      hasNext: false,
      hasPrev: false,
    },
  }),

  getters: {
    featuredProducts: (state) => 
      state.products.filter(product => product.rating >= 4.5),
    
    productsByCategory: (state) => (categoryId: string) =>
      state.products.filter(product => product.category.id === categoryId),
    
    getProductById: (state) => (id: string) =>
      state.products.find(product => product.id === id),
    
    hasProducts: (state) => state.products.length > 0,
    
    totalProducts: (state) => state.pagination.total,
  },

  actions: {
    async fetchProducts(params?: ProductSearchParams) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch<PaginatedResponse<Product>>('/api/marketplace/products', {
          params: { ...this.searchParams, ...params },
        })

        this.products = data.items
        this.pagination = {
          page: data.page,
          limit: data.limit,
          total: data.total,
          hasNext: data.hasNext,
          hasPrev: data.hasPrev,
        }
      } catch (error) {
        this.error = 'Failed to fetch products'
        console.error('Error fetching products:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchProductById(id: string) {
      this.isLoading = true
      this.error = null

      try {
        const product = await $fetch<Product>(`/api/marketplace/products/${id}`)
        
        // Update product in store if it exists
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = product
        } else {
          this.products.push(product)
        }
        
        return product
      } catch (error) {
        this.error = 'Failed to fetch product'
        console.error('Error fetching product:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      try {
        this.categories = await $fetch<ProductCategory[]>('/api/marketplace/categories')
      } catch (error) {
        this.error = 'Failed to fetch categories'
        console.error('Error fetching categories:', error)
      }
    },

    async searchProducts(query: string, filters?: ProductFilter) {
      this.searchParams = { q: query, filters }
      await this.fetchProducts()
    },

    setFilters(filters: ProductFilter) {
      this.filters = { ...this.filters, ...filters }
      this.searchParams = { ...this.searchParams, filters: this.filters }
    },

    clearFilters() {
      this.filters = {}
      this.searchParams = { ...this.searchParams, filters: {} }
    },

    setCategory(category: ProductCategory | null) {
      this.selectedCategory = category
      if (category) {
        this.searchParams = { ...this.searchParams, category: category.slug }
      } else {
        delete this.searchParams.category
      }
    },

    async loadMore() {
      if (!this.pagination.hasNext || this.isLoading) return

      const nextPage = this.pagination.page + 1
      
      try {
        this.isLoading = true
        const { data } = await $fetch<PaginatedResponse<Product>>('/api/marketplace/products', {
          params: { ...this.searchParams, page: nextPage },
        })

        this.products.push(...data.items)
        this.pagination = {
          page: data.page,
          limit: data.limit,
          total: data.total,
          hasNext: data.hasNext,
          hasPrev: data.hasPrev,
        }
      } catch (error) {
        this.error = 'Failed to load more products'
        console.error('Error loading more products:', error)
      } finally {
        this.isLoading = false
      }
    },

    resetProducts() {
      this.products = []
      this.pagination = {
        page: 1,
        limit: 12,
        total: 0,
        hasNext: false,
        hasPrev: false,
      }
    },
  },
}) 