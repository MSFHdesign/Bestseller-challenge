import { defineEventHandler, getQuery } from 'h3';
import data from '../data/data.json';

// Add interface at the top of the file
interface Product {
  id: number | string;
  brand: string;
  price: number;
  stock: number | string; // Allow both number and string
  color: string;
  size: (string | number)[]; // Allow both string and number arrays
  name: {
    dk?: string;
    en?: string;
  };
  images: string[];
  categories?: string[];
  variant?: Array<{
    color: string;
    stock: number | string;
    size: (string | number)[];
    images?: string[];
  }>;
  isVariant?: boolean;
}

export default defineEventHandler((event) => {
  if (!data || !data.products || !Array.isArray(data.products)) {
    return { products: [] };
  }

  const query = getQuery(event);
  const searchTerm = typeof query.q === 'string' ? query.q.toLowerCase() : "";
 // fun
  const generateVariantId = (productId: string, variantColor: string): string => {
    return `${productId}-${variantColor.replace(/\s+/g, '').toLowerCase()}`;
  };

  // Update the declaration with type
  let expandedProducts: Product[] = [];
  // Udvid produkter med deres varianter
  data.products.forEach((product) => {
    // Hovedproduktet
    const mainProduct: Product = {
      id: product.id,
      brand: product.brand,
      price: product.price,
      stock: Number(product.stock), // Ensure stock is a number
      color: product.color,
      size: Array.isArray(product.size) ? product.size : [], // Ensure size is string[]
      name: {
        dk: product.name?.dk || '',
        en: product.name?.en || ''
      },
      images: product.images || [], // Ensure images is always an array
      variant: product.variant,
      isVariant: false
    };
    expandedProducts.push(mainProduct);

    // Håndter varianter som selvstændige produkter
    if (product.variant && Array.isArray(product.variant)) {
      product.variant.forEach((variant) => {
        expandedProducts.push({
          ...product,
          id: generateVariantId(String(product.id), variant.color),
          color: variant.color,
          stock: variant.stock,
          size: variant.size,
          images: variant.images?.length ? variant.images : product.images,
          isVariant: true, // Markér som variant
        });
      });
    }
  });

  // Filtrering
  let filteredProducts = expandedProducts.filter((product) => {
    return product.name?.dk?.toLowerCase().includes(searchTerm) ||
           product.name?.en?.toLowerCase().includes(searchTerm);
  });

  // Hvis ingen resultater → returner de mest populære produkter
  if (filteredProducts.length === 0) {
    filteredProducts = expandedProducts
      .sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0))
      .slice(0, 5);
  }

  return { products: filteredProducts };
});
