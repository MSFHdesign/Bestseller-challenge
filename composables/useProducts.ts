import { ref, useState, useAsyncData, computed } from '#imports';

/**
 * Product interface representing the structure of product data
 * 
 * @interface Product
 */
interface Product {
  /** Unique identifier for the product */
  id: number;
  /** Brand name of the product */
  brand: string;
  /** Price in DKK */
  price: number;
  /** Available stock quantity */
  stock: number;
  /** Main color of the product */
  color: string;
  /** Available sizes */
  size: string[];
  /** Localized product names */
  name: { dk: string; en: string };
  /** Array of image URLs */
  images: string[];
  /** Categories this product belongs to */
  categories: string[];
  /** Optional variant information */
  variant?: { color: string; size: string[] };
}

/**
 * PromotionalSpot interface representing promotional content
 * 
 * @interface PromotionalSpot
 */
interface PromotionalSpot {
  /** Target URL for the promotion */
  link: string;
  /** Position in the product grid (0-based index) */
  position: number;
  /** Type of promotional spot (e.g., '2x2', 'banner') */
  type: string;
  /** Image configuration */
  image: {
    /** Aspect ratio (e.g., '16:9') */
    aspectRatio: string;
    /** URL to the image */
    imageUrl: string;
    /** Focal point for responsive cropping */
    focalPoint: { x: number; y: number };
    /** Maximum width constraint */
    maxWidth: string;
    /** Alt text for accessibility */
    alt: string;
  };
  /** Alternative text for the image */
  imageAltText: string;
  /** Internal alias/identifier */
  _alias: string;
}

/**
 * Category interface for product categorization
 * 
 * @interface Category
 */
interface Category {
  /** Unique identifier for the category */
  id: number;
  /** Display name of the category */
  name: string;
}

/**
 * Promotion interface (alias of PromotionalSpot for clarity)
 * 
 * @interface Promotion
 */
interface Promotion extends PromotionalSpot {}

/**
 * useProducts composable
 * 
 * Provides access to products and promotional spots data with loading states.
 * Handles data fetching, caching, and refreshing.
 * 
 * @returns {Object} Products, promotional spots, loading state, and utility functions
 * 
 * @example
 * const { products, promotionalSpots, loading, refresh } = useProducts()
 * 
 * // Access products
 * const featuredProducts = computed(() => 
 *   products.value.filter(p => p.categories.includes('featured'))
 * )
 * 
 * // Manually refresh data if needed
 * const handleRefresh = async () => {
 *   await refresh()
 *   console.log('Products refreshed!')
 * }
 */
export function useProducts() {
  // State management with proper typing
  const productsState = useState<Product[]>('products', () => []);
  const promotionalSpotsState = useState<PromotionalSpot[]>('promotionalSpots', () => []);
  const loadingState = useState<boolean>('productsLoading', () => true);
  const hasInitialized = useState<boolean>('productsInitialized', () => false);

  /**
   * Fetch products data from API
   * Uses Nuxt's useAsyncData for efficient data fetching and caching
   */
  const { data: productsData, pending: productsLoading, refresh: refreshProducts } = useAsyncData(
    'products',
    () => $fetch<{ products: Product[] }>('/api/products'),
    {
      // Add these options to prevent unnecessary refetches
      watch: [],
      lazy: true,
      transform: (data) => {
        productsState.value = data.products || [];
        return data;
      }
    }
  );

  /**
   * Fetch promotional spots data from API
   * Uses Nuxt's useAsyncData for efficient data fetching and caching
   */
  const { data: promotionsData, pending: promosLoading, refresh: refreshPromotions } = useAsyncData(
    'promotions',
    () => $fetch<{ promotionalSpots: PromotionalSpot[] }>('/api/promotions'),
    {
      // Add these options to prevent unnecessary refetches
      watch: [],
      lazy: true,
      transform: (data) => {
        promotionalSpotsState.value = data.promotionalSpots || [];
        return data;
      }
    }
  );

  // Computed properties for reactive access to state
  const products = computed(() => productsState.value);
  const promotionalSpots = computed(() => promotionalSpotsState.value);
  const loading = computed(() => productsLoading.value || promosLoading.value);

  /**
   * Refresh both products and promotional spots data
   * 
   * @returns {Promise<void>} Promise that resolves when both data sources are refreshed
   */
  const refresh = async () => {
    loadingState.value = true;
    try {
      await Promise.all([
        refreshProducts(),
        refreshPromotions()
      ]);
      hasInitialized.value = true;
    } finally {
      loadingState.value = false;
    }
  };

  // Initialize data only once if not already initialized
  if (process.client && !hasInitialized.value && !productsState.value.length) {
    refresh();
  }

  return {
    products,
    promotionalSpots,
    loading,
    refresh,
    hasInitialized
  };
}
