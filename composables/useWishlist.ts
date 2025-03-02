import { ref, onMounted, watch, computed } from 'vue'
import { useEventBus } from './useEventBus'

/**
 * Shared wishlist state that persists across component instances
 * Contains product IDs of items in the wishlist
 */
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

/**
 * useWishlist composable
 * 
 * Provides wishlist functionality for saving favorite products.
 * Includes persistence to localStorage and integration with the event bus.
 * 
 * @returns {Object} Wishlist state and methods for wishlist manipulation
 * 
 * @example
 * const { wishlist, isInWishlist, toggleWishlist, count } = useWishlist()
 * 
 * // Check if a product is in the wishlist
 * const isFavorite = computed(() => isInWishlist(product.id))
 * 
 * // Toggle wishlist status
 * const handleFavoriteClick = () => {
 *   toggleWishlist(product.id)
 * }
 */
export function useWishlist() {
    /**
     * Check if a product is in the wishlist
     * 
     * @param {string} productId - The product ID to check
     * @returns {boolean} True if the product is in the wishlist
     */
    const isInWishlist = (productId: string) => {
        return wishlist.value.includes(productId)
    }

    /**
     * Toggle a product's presence in the wishlist
     * If the product is already in the wishlist, it will be removed
     * If not, it will be added
     * 
     * @param {string} productId - The product ID to toggle
     */
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

    /**
     * Number of items in the wishlist
     * 
     * @returns {number} The count of wishlist items
     */
    const count = computed(() => wishlist.value.length)

    return {
        wishlist,
        isInWishlist,
        toggleWishlist,
        count
    }
} 