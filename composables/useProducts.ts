import { ref, onMounted } from 'vue';

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
  const products = ref<Product[]>([]);
  const categories = ref<Category[]>([]);
  const promotions = ref<Promotion[]>([]);

  // Fetch the data from the API
  const fetchData = async () => { 
    try {
      const productsRes = await useFetch<{ products: Product[] }>('/api/products');
      const categoriesRes = await useFetch<{ categories: Category[] }>('/api/categories');
      const promotionsRes = await useFetch<{ promotionalSpots: Promotion[] }>('/api/promotions');

      // Handle potential null values safely
      if (productsRes.data.value) {
        products.value = productsRes.data.value.products;
      }
      if (categoriesRes.data.value) {
        categories.value = categoriesRes.data.value.categories;
      }
      if (promotionsRes.data.value) {
        promotions.value = promotionsRes.data.value.promotionalSpots;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  // Fetch the data when the component is mounted
  onMounted(fetchData);

  // Return the data
  return { products, categories, promotions };
}
