import { parseJSON } from './parsers/jsonParser';
import logger from './util/logger';

export async function main1() {
  const data = await parseJSON('src/data/book_orders.json');

  if (Array.isArray(data)) {
    data.forEach((row, i) => logger.info("Row %d: %o", i + 1, row));
  } else {
    logger.info("Parsed object: %o", data);
  }

  return data; 
}


if (require.main === module) {
  main1();
}
