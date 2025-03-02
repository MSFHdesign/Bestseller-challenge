import { defineEventHandler } from 'h3';
import data from '../../server/data/data.json';

export default defineEventHandler(() => {

  return { categories: Array.isArray(data.categories) ? data.categories : [] };
});
