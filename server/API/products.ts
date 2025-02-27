import { defineEventHandler } from 'h3';
import data from '../data/data.json';

export default defineEventHandler(() => {
  if (!data || !data.products) {
    return { products: [] };
  }
  return { products: data.products };
});
