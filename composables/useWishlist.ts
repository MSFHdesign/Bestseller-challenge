import { ref, onMounted, watch, computed } from 'vue'
import { useEventBus } from './useEventBus'

// Create a single shared wishlist instance
const wishlist = ref<string[]>([])
const { emit } = useEventBus()

// Initialize from localStorage if we're in the browser
if (process.client) {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
        try {
            wishlist.value = JSON.parse(savedWishlist)
        } catch (e) {
            console.error('Failed to parse wishlist from localStorage', e)
            wishlist.value = []
        }
    }
}

// Save wishlist to localStorage whenever it changes
watch(wishlist, (newWishlist) => {
    if (process.client) {
        localStorage.setItem('wishlist', JSON.stringify(newWishlist))
    }
    // Emit event when wishlist changes
    emit('wishlist:updated', newWishlist)
}, { deep: true })

export function useWishlist() {
    const isInWishlist = (productId: string) => {
        return wishlist.value.includes(productId)
    }

    const toggleWishlist = (productId: string) => {
        const index = wishlist.value.indexOf(productId)
        console.log('Toggling wishlist for product:', productId, 'Current wishlist:', wishlist.value)
        
        if (index === -1) {
            // Create a new array to ensure reactivity
            wishlist.value = [...wishlist.value, productId]
            console.log('Added to wishlist, new wishlist:', wishlist.value)
        } else {
            // Create a new array to ensure reactivity
            wishlist.value = wishlist.value.filter(id => id !== productId)
            console.log('Removed from wishlist, new wishlist:', wishlist.value)
        }
        
        // Emit event directly after updating
        emit('wishlist:updated', wishlist.value)
    }

    // Add a count computed property for easy access
    const count = computed(() => wishlist.value.length)

    return {
        wishlist,
        isInWishlist,
        toggleWishlist,
        count
    }
} 