interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  image: string
  price: number
  quantity: number
  weight?: number
  sellerId: string
  sellerName: string
}

interface ShippingAddress {
  name: string
  phone: string
  address: string
  city: string
  region: string
  postalCode?: string
  notes?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  shippingAddress: ShippingAddress | null
  deliveryMethod: 'home' | 'pickup' | 'relay'
  paymentMethod: 'cash' | 'mobile_money' | 'bank_transfer' | 'card'
  couponCode: string | null
  discount: number
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    isOpen: false,
    isLoading: false,
    shippingAddress: null,
    deliveryMethod: 'home',
    paymentMethod: 'cash',
    couponCode: null,
    discount: 0
  }),

  getters: {
    cartItemsCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    subtotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    
    totalWeight: (state) => state.items.reduce((total, item) => total + ((item.weight || 0) * item.quantity), 0),
    
    shippingCost: (state) => {
      // Calcul dynamique des frais de livraison
      const weight = state.items.reduce((total, item) => total + ((item.weight || 0) * item.quantity), 0)
      const baseShipping = 2000 // 2000 MGA de base
      const weightShipping = Math.ceil(weight / 1000) * 500 // 500 MGA par kg
      
      if (state.deliveryMethod === 'pickup') return 0
      if (state.deliveryMethod === 'relay') return baseShipping * 0.7
      
      return baseShipping + weightShipping
    },
    
    tax: (state) => {
      const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      return Math.round(subtotal * 0.02) // 2% de TVA
    },
    
    total: (state, getters) => {
      return getters.subtotal + getters.shippingCost + getters.tax - state.discount
    },
    
    isEmpty: (state) => state.items.length === 0,
    
    uniqueSellers: (state) => {
      const sellers = new Set(state.items.map(item => item.sellerId))
      return Array.from(sellers)
    },
    
    itemsBySeller: (state) => {
      return state.items.reduce((acc, item) => {
        if (!acc[item.sellerId]) {
          acc[item.sellerId] = {
            sellerName: item.sellerName,
            items: []
          }
        }
        acc[item.sellerId].items.push(item)
        return acc
      }, {} as Record<string, { sellerName: string; items: CartItem[] }>)
    }
  },

  actions: {
    async initializeCart() {
      // Récupérer le panier depuis le localStorage ou l'API
      if (process.client) {
        const savedCart = localStorage.getItem('fataplus-cart')
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart)
            this.items = parsedCart.items || []
            this.shippingAddress = parsedCart.shippingAddress || null
            this.deliveryMethod = parsedCart.deliveryMethod || 'home'
            this.paymentMethod = parsedCart.paymentMethod || 'cash'
          } catch (error) {
            console.error('Erreur lors du chargement du panier:', error)
          }
        }
      }

      // Synchroniser avec l'API si l'utilisateur est connecté
      const { isAuthenticated } = useAuthStore()
      if (isAuthenticated) {
        await this.syncWithServer()
      }
    },

    async addItem(product: any, quantity: number = 1, variantId?: string) {
      const existingItemIndex = this.items.findIndex(
        item => item.productId === product.id && item.variantId === variantId
      )

      if (existingItemIndex > -1) {
        // Mettre à jour la quantité de l'article existant
        this.items[existingItemIndex].quantity += quantity
      } else {
        // Ajouter un nouvel article
        const cartItem: CartItem = {
          id: `${product.id}-${variantId || 'default'}`,
          productId: product.id,
          variantId,
          name: product.name,
          image: product.images?.[0] || '/images/placeholder.jpg',
          price: variantId ? product.variants?.find((v: any) => v.id === variantId)?.price || product.price : product.price,
          quantity,
          weight: product.weight,
          sellerId: product.sellerId,
          sellerName: product.seller?.name || 'Vendeur'
        }
        
        this.items.push(cartItem)
      }

      await this.saveCart()
      
      // Notification
      useToast().add({
        title: 'Produit ajouté',
        description: `${product.name} a été ajouté au panier`,
        color: 'green'
      })

      // Analytics
      await this.trackCartEvent('add_to_cart', {
        productId: product.id,
        quantity,
        price: product.price
      })
    },

    async removeItem(itemId: string) {
      const itemIndex = this.items.findIndex(item => item.id === itemId)
      if (itemIndex > -1) {
        const item = this.items[itemIndex]
        this.items.splice(itemIndex, 1)
        
        await this.saveCart()
        
        useToast().add({
          title: 'Produit retiré',
          description: `${item.name} a été retiré du panier`,
          color: 'orange'
        })

        await this.trackCartEvent('remove_from_cart', {
          productId: item.productId,
          quantity: item.quantity
        })
      }
    },

    async updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find(item => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          await this.removeItem(itemId)
        } else {
          item.quantity = quantity
          await this.saveCart()
        }
      }
    },

    async clearCart() {
      this.items = []
      this.discount = 0
      this.couponCode = null
      await this.saveCart()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    closeCart() {
      this.isOpen = false
    },

    openCart() {
      this.isOpen = true
    },

    async applyCoupon(code: string) {
      this.isLoading = true
      try {
        const { data } = await $fetch('/api/cart/apply-coupon', {
          method: 'POST',
          body: { code, subtotal: this.subtotal }
        })

        this.couponCode = code
        this.discount = data.discount

        useToast().add({
          title: 'Code promo appliqué',
          description: `Vous économisez ${data.discount} MGA`,
          color: 'green'
        })

        await this.saveCart()
        return { success: true }
      } catch (error: any) {
        useToast().add({
          title: 'Code promo invalide',
          description: error.data?.message || 'Ce code n\'est pas valide',
          color: 'red'
        })
        return { success: false, error: error.data?.message }
      } finally {
        this.isLoading = false
      }
    },

    async removeCoupon() {
      this.couponCode = null
      this.discount = 0
      await this.saveCart()
    },

    updateShippingAddress(address: ShippingAddress) {
      this.shippingAddress = address
      this.saveCart()
    },

    updateDeliveryMethod(method: 'home' | 'pickup' | 'relay') {
      this.deliveryMethod = method
      this.saveCart()
    },

    updatePaymentMethod(method: 'cash' | 'mobile_money' | 'bank_transfer' | 'card') {
      this.paymentMethod = method
      this.saveCart()
    },

    async proceedToCheckout() {
      if (this.isEmpty) {
        useToast().add({
          title: 'Panier vide',
          description: 'Ajoutez des produits à votre panier',
          color: 'orange'
        })
        return false
      }

      if (!this.shippingAddress && this.deliveryMethod === 'home') {
        useToast().add({
          title: 'Adresse manquante',
          description: 'Veuillez ajouter une adresse de livraison',
          color: 'orange'
        })
        return false
      }

      await navigateTo('/checkout')
      return true
    },

    async createOrder() {
      this.isLoading = true
      try {
        const orderData = {
          items: this.items,
          shippingAddress: this.shippingAddress,
          deliveryMethod: this.deliveryMethod,
          paymentMethod: this.paymentMethod,
          couponCode: this.couponCode,
          subtotal: this.subtotal,
          shippingCost: this.shippingCost,
          tax: this.tax,
          discount: this.discount,
          total: this.total
        }

        const { data } = await $fetch('/api/orders', {
          method: 'POST',
          body: orderData
        })

        // Vider le panier après commande réussie
        await this.clearCart()

        useToast().add({
          title: 'Commande créée',
          description: `Commande n°${data.orderNumber} créée avec succès`,
          color: 'green'
        })

        // Redirection vers la page de confirmation
        await navigateTo(`/orders/${data.id}`)

        return { success: true, order: data }
      } catch (error: any) {
        useToast().add({
          title: 'Erreur de commande',
          description: error.data?.message || 'Une erreur est survenue',
          color: 'red'
        })
        return { success: false, error: error.data?.message }
      } finally {
        this.isLoading = false
      }
    },

    async saveCart() {
      if (process.client) {
        const cartData = {
          items: this.items,
          shippingAddress: this.shippingAddress,
          deliveryMethod: this.deliveryMethod,
          paymentMethod: this.paymentMethod,
          couponCode: this.couponCode,
          discount: this.discount
        }
        localStorage.setItem('fataplus-cart', JSON.stringify(cartData))
      }

      // Synchroniser avec le serveur si connecté
      const { isAuthenticated } = useAuthStore()
      if (isAuthenticated) {
        try {
          await $fetch('/api/cart/sync', {
            method: 'POST',
            body: { items: this.items }
          })
        } catch (error) {
          console.error('Erreur de synchronisation du panier:', error)
        }
      }
    },

    async syncWithServer() {
      try {
        const { data } = await $fetch('/api/cart')
        if (data.items?.length > 0) {
          // Fusionner les paniers local et serveur
          const mergedItems = [...this.items]
          
          data.items.forEach((serverItem: CartItem) => {
            const existingIndex = mergedItems.findIndex(
              item => item.productId === serverItem.productId && item.variantId === serverItem.variantId
            )
            
            if (existingIndex > -1) {
              mergedItems[existingIndex].quantity = Math.max(
                mergedItems[existingIndex].quantity,
                serverItem.quantity
              )
            } else {
              mergedItems.push(serverItem)
            }
          })
          
          this.items = mergedItems
          await this.saveCart()
        }
      } catch (error) {
        console.error('Erreur de synchronisation du panier:', error)
      }
    },

    async trackCartEvent(event: string, data: any) {
      try {
        await $fetch('/api/analytics/track', {
          method: 'POST',
          body: {
            event,
            data,
            page: 'cart'
          }
        })
      } catch (error) {
        console.error('Erreur de tracking:', error)
      }
    }
  }
}) 