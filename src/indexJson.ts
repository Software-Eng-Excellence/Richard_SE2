import { JSONBookMapper } from './mappers/Book.mappers';
import { JSONOrderMapper } from './mappers/OrderJson.mapper';
import { parseJSON } from './parsers/jsonParser';
import logger from './util/logger';

export async function main1() {
  try{
  const data = await parseJSON('src/data/book_orders.json');

  // if (Array.isArray(data)) {
  //   data.forEach((row, i) => logger.info("Row %d: %o", i + 1, row));
  // } else {
  //   logger.info("Parsed object: %o", data);
  // }
  const bookMapper  = new JSONBookMapper();
  const orderMapper = new JSONOrderMapper(bookMapper);
  const orders = Array.isArray(data) ? data.map(orderMapper.map.bind(orderMapper)) : [];

  logger.info("List of orders: %o", orders);
  } catch(error){
    logger.error("Failed to load or map orders: %o", error);
  }
}



  main1();
