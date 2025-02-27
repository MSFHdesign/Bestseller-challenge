import { defineEventHandler } from 'h3';
import data from '../data/data.json';

export default defineEventHandler(() => {
  return { promotionalSpots: data.promotionalSpots || [] };
});
