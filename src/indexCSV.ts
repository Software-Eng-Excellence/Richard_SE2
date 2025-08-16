import path from 'path';
import { parseCSV } from './parsers/csvParser';
import logger from './util/logger';

const filePath = path.resolve(__dirname, './data/Cake_orders.csv');

export async function main() {
  try {
    const products = await parseCSV(filePath);
    for (const product of products) {
      logger.info(product + '\n');
    }
    return products; 
  } catch (error) {
    logger.error(error);
    throw error; 
  }
}


if (require.main === module) {
  main();
}
