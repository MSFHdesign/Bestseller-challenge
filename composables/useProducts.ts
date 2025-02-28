import { ref, useAsyncData, computed } from '#imports';

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
  const { data: productsData, pending: productsLoading } = useAsyncData('products',
    () => $fetch('/api/products')
  );

  const { data: promotionsData, pending: promosLoading } = useAsyncData('promotions',
    () => $fetch('/api/promotions')
  );

  const products = computed(() => productsData.value?.products || []);
  const promotionalSpots = computed(() => promotionsData.value?.promotionalSpots || []);
  const loading = computed(() => productsLoading.value || promosLoading.value);

  return {
    products,
    promotionalSpots,
    loading
  };
}
