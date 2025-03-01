import { ref, watch, computed } from 'vue'

// Define the CartItem interface
interface CartItem {
  id: string | number
  price: number
  quantity: number
  selectedSize?: string
  selectedVariant?: {
    id: string | number
    [key: string]: any
  }
  [key: string]: any
}

// Create a single shared cart instance with proper typing
const cart = ref<CartItem[]>([])

// Initialize cart from localStorage
if (process.client) {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
        cart.value = JSON.parse(savedCart)
    }
}

export function useCart() {
    // Watch for changes and update localStorage
    if (process.client) {
        watch(cart, (newCart) => {
            localStorage.setItem('cart', JSON.stringify(newCart))
        }, { deep: true })
    }

    const addToCart = (product: CartItem) => {
        // Create a copy of the product to avoid reference issues
        const productToAdd = { ...product, quantity: 1 }
        
        // Find if this product (with same variant and size) already exists in cart
        const existingItemIndex = cart.value.findIndex(item => 
            item.id === product.id && 
            item.selectedSize === product.selectedSize &&
            ((!item.selectedVariant && !product.selectedVariant) ||
             (item.selectedVariant?.id === product.selectedVariant?.id))
        )
        
        if (existingItemIndex >= 0) {
            // Update quantity of existing item
            const updatedCart = [...cart.value]
            updatedCart[existingItemIndex].quantity += 1
            cart.value = updatedCart
        } else {
            // Add new item to cart
            cart.value = [...cart.value, productToAdd]
        }
    }

    const removeItem = (index: number) => {
        cart.value.splice(index, 1)
    }

    const updateQuantity = (index: number, quantity: number) => {
        if (index >= 0 && index < cart.value.length) {
            const updatedCart = [...cart.value]
            updatedCart[index].quantity = quantity
            cart.value = updatedCart
        }
    }

    const clearCart = () => {
        cart.value = []
    }

    const cartTotal = computed(() => {
        return cart.value.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1))
        }, 0)
    })

    return {
        cart,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal
    }
}
