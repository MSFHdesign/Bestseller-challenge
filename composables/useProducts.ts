import { ref, useState, useAsyncData, computed } from '#imports';

// Define the types for the data
interface Product {
  id: number;
  brand: string;
  price: number;
  stock: number;
  color: string;
  size: string[];
  name: { dk: string; en: string };
  images: string[];
  categories: string[];
  variant?: { color: string; size: string[] };
}

interface PromotionalSpot {
  link: string;
  position: number;
  type: string;
  image: {
    aspectRatio: string;
    imageUrl: string;
    focalPoint: { x: number; y: number };
    maxWidth: string;
    alt: string;
  };
  imageAltText: string;
  _alias: string;
}

// Define the types for the categories
interface Category {
  id: number;
  name: string;
}
// Define the types for the promotions
interface Promotion {
  link: string;
  position: number;
  type: string;
  image: {
    aspectRatio: string;
    imageUrl: string;
    focalPoint: { x: number; y: number };
    maxWidth: string;
    alt: string;
  };
  imageAltText: string;
  _alias: string;
}

// Define the composable
export function useProducts() {
  // Use useState with proper typing
  const productsState = useState<Product[]>('products', () => []);
  const promotionalSpotsState = useState<PromotionalSpot[]>('promotionalSpots', () => []);
  const loadingState = useState<boolean>('productsLoading', () => true);
  const hasInitialized = useState<boolean>('productsInitialized', () => false);

  const { data: productsData, pending: productsLoading, refresh: refreshProducts } = useAsyncData(
    'products',
    () => $fetch<{ products: Product[] }>('/api/products'),
    {
      // Add these options to prevent unnecessary refetches
      watch: false,
      lazy: true,
      transform: (data) => {
        productsState.value = data.products || [];
        return data;
      }
    }
  );

  const { data: promotionsData, pending: promosLoading, refresh: refreshPromotions } = useAsyncData(
    'promotions',
    () => $fetch<{ promotionalSpots: PromotionalSpot[] }>('/api/promotions'),
    {
      // Add these options to prevent unnecessary refetches
      watch: false,
      lazy: true,
      transform: (data) => {
        promotionalSpotsState.value = data.promotionalSpots || [];
        return data;
      }
    }
  );

  const products = computed(() => productsState.value);
  const promotionalSpots = computed(() => promotionalSpotsState.value);
  const loading = computed(() => productsLoading.value || promosLoading.value);

  const refresh = async () => {
    if (loading.value || hasInitialized.value) return; // Prevent multiple refreshes
    
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
