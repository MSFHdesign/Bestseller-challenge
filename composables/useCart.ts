import { ref, watch, computed } from 'vue'

/**
 * CartItem interface representing an item in the shopping cart
 * 
 * @interface CartItem
 */
interface CartItem {
  /** Unique identifier for the product */
  id: string | number;
  /** Price per unit in DKK */
  price: number;
  /** Quantity of this item in the cart */
  quantity: number;
  /** Selected size if applicable */
  selectedSize?: string;
  /** Selected variant information if applicable */
  selectedVariant?: {
    /** Variant identifier */
    id: string | number;
    /** Additional variant properties */
    [key: string]: any;
  };
  /** Additional product properties */
  [key: string]: any;
}

/**
 * Shared cart state that persists across component instances
 * This ensures all components access the same cart data
 */
const cart = ref<CartItem[]>([])

// Initialize cart from localStorage when in browser environment
if (process.client) {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
        cart.value = JSON.parse(savedCart)
    }
}

/**
 * useCart composable
 * 
 * Provides shopping cart functionality including adding/removing items,
 * updating quantities, calculating totals, and persistence to localStorage.
 * 
 * @returns {Object} Cart state and methods for cart manipulation
 * 
 * @example
 * const { cart, addToCart, removeItem, cartTotal } = useCart()
 * 
 * // Add a product to cart
 * const handleAddToCart = (product) => {
 *   addToCart({
 *     ...product,
 *     selectedSize: selectedSize.value,
 *     selectedVariant: selectedVariant.value
 *   })
 * }
 */
export function useCart() {
    // Watch for changes and update localStorage
    if (process.client) {
        watch(cart, (newCart) => {
            localStorage.setItem('cart', JSON.stringify(newCart))
        }, { deep: true })
    }

    /**
     * Add a product to the cart
     * If the product already exists with the same variant and size, increase quantity
     * 
     * @param {CartItem} product - The product to add to the cart
     */
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

    /**
     * Remove an item from the cart by index
     * 
     * @param {number} index - The index of the item to remove
     */
    const removeItem = (index: number) => {
        cart.value.splice(index, 1)
    }

    /**
     * Update the quantity of an item in the cart
     * 
     * @param {number} index - The index of the item to update
     * @param {number} quantity - The new quantity (must be positive)
     */
    const updateQuantity = (index: number, quantity: number) => {
        if (index >= 0 && index < cart.value.length) {
            const updatedCart = [...cart.value]
            updatedCart[index].quantity = quantity
            cart.value = updatedCart
        }
    }

    /**
     * Clear all items from the cart
     */
    const clearCart = () => {
        cart.value = []
    }

    /**
     * Calculate the total price of all items in the cart
     * 
     * @returns {number} The total price in DKK
     */
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
