import { defineStore } from 'pinia'
import type { CartItem, Product } from '#types'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  lastUpdated: Date | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    isLoading: false,
    lastUpdated: null,
  }),

  getters: {
    totalItems: (state) => 
      state.items.reduce((total, item) => total + item.quantity, 0),
    
    totalPrice: (state) => 
      state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    
    itemCount: (state) => state.items.length,
    
    isEmpty: (state) => state.items.length === 0,
    
    getItemById: (state) => (productId: string) =>
      state.items.find(item => item.productId === productId),
    
    getItemQuantity: (state) => (productId: string) => {
      const item = state.items.find(item => item.productId === productId)
      return item ? item.quantity : 0
    },

    itemsByVendor: (state) => {
      const grouped = state.items.reduce((acc, item) => {
        if (!acc[item.sellerId]) {
          acc[item.sellerId] = []
        }
        acc[item.sellerId].push(item)
        return acc
      }, {} as Record<string, CartItem[]>)
      
      return Object.entries(grouped).map(([sellerId, items]) => ({
        sellerId,
        sellerName: items[0].sellerName,
        items,
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }))
    },
  },

  actions: {
    addItem(product: Product, quantity: number = 1) {
      const existingItem = this.items.find(item => item.productId === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        const cartItem: CartItem = {
          id: `cart_${product.id}_${Date.now()}`,
          productId: product.id,
          name: product.name,
          image: product.images[0] || '',
          price: product.price,
          quantity,
          sellerId: product.vendorId,
          sellerName: product.vendor.name,
        }
        this.items.push(cartItem)
      }
      
      this.lastUpdated = new Date()
      this.saveToStorage()
    },

    removeItem(productId: string) {
      const index = this.items.findIndex(item => item.productId === productId)
      if (index > -1) {
        this.items.splice(index, 1)
        this.lastUpdated = new Date()
        this.saveToStorage()
      }
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find(item => item.productId === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else {
          item.quantity = quantity
          this.lastUpdated = new Date()
          this.saveToStorage()
        }
      }
    },

    incrementQuantity(productId: string) {
      const item = this.items.find(item => item.productId === productId)
      if (item) {
        item.quantity += 1
        this.lastUpdated = new Date()
        this.saveToStorage()
      }
    },

    decrementQuantity(productId: string) {
      const item = this.items.find(item => item.productId === productId)
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
        } else {
          this.removeItem(productId)
        }
        this.lastUpdated = new Date()
        this.saveToStorage()
      }
    },

    clearCart() {
      this.items = []
      this.lastUpdated = new Date()
      this.saveToStorage()
    },

    async syncWithServer() {
      this.isLoading = true
      try {
        // Sync cart with server (for logged-in users)
        const { data } = await $fetch('/api/marketplace/cart')
        this.items = data.items
        this.lastUpdated = new Date(data.updatedAt)
      } catch (error) {
        console.error('Failed to sync cart:', error)
      } finally {
        this.isLoading = false
      }
    },

    async saveToServer() {
      if (this.items.length === 0) return

      try {
        await $fetch('/api/marketplace/cart', {
          method: 'POST',
          body: { items: this.items },
        })
      } catch (error) {
        console.error('Failed to save cart to server:', error)
      }
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem('fataplus_cart', JSON.stringify({
          items: this.items,
          lastUpdated: this.lastUpdated,
        }))
      }
    },

    loadFromStorage() {
      if (import.meta.client) {
        const stored = localStorage.getItem('fataplus_cart')
        if (stored) {
          try {
            const { items, lastUpdated } = JSON.parse(stored)
            this.items = items || []
            this.lastUpdated = lastUpdated ? new Date(lastUpdated) : null
          } catch (error) {
            console.error('Failed to load cart from storage:', error)
            this.clearCart()
          }
        }
      }
    },

    // Calculate shipping cost based on items and delivery method
    calculateShipping(deliveryMethod: 'home' | 'pickup' | 'relay' = 'home') {
      if (deliveryMethod === 'pickup') return 0
      
      const totalWeight = this.items.reduce((total, item) => {
        return total + (item.weight || 1) * item.quantity
      }, 0)
      
      // Basic shipping calculation - can be enhanced with real logistics API
      const baseRate = deliveryMethod === 'home' ? 2000 : 1000 // MGA
      const weightRate = Math.ceil(totalWeight / 5) * 500 // MGA per 5kg
      
      return baseRate + weightRate
    },
  },

  // Auto-save to storage when state changes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $subscribe: (mutation, state) => {
    if (import.meta.client) {
      state.saveToStorage()
    }
  },
}) 