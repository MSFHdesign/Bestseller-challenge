import { defineEventHandler } from 'h3';
import data from '../data/data.json';

export default defineEventHandler(async (event) => {
  return {
    promotionalSpots: data.promotionalSpots || []
  };
});
