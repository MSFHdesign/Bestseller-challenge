import { ref, watch } from 'vue'

// Create a single shared cart instance
const cart = ref([])

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

    const addToCart = (product) => {
        const existingItem = cart.value.find(item => item.id === product.id)
        if (existingItem) {
            existingItem.quantity++
        } else {
            cart.value.push({ ...product, quantity: 1 })
        }
    }

    const removeFromCart = (productId) => {
        cart.value = cart.value.filter(item => item.id !== productId)
    }

    const updateQuantity = (productId, quantity) => {
        const item = cart.value.find(item => item.id === productId)
        if (item) {
            item.quantity = quantity
        }
    }

    const clearCart = () => {
        cart.value = []
    }

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    }
}
