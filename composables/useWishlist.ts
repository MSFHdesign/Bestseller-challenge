import { ref } from 'vue'

export function useWishlist() {
    const wishlist = ref<string[]>([])

    const isInWishlist = (productId: string) => {
        return wishlist.value.includes(productId)
    }

    const toggleWishlist = (productId: string) => {
        const index = wishlist.value.indexOf(productId)
        if (index === -1) {
            wishlist.value.push(productId)
        } else {
            wishlist.value.splice(index, 1)
        }
    }

    return {
        wishlist,
        isInWishlist,
        toggleWishlist
    }
} 