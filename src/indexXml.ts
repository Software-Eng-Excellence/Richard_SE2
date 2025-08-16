import { parseXML } from './parsers/xmlParser';
import logger from './util/logger';

export async function mainXML() {
  try {
    const data = await parseXML('src/data/toy_orders.xml');
    
   
    console.log(data);
    logger.info("%o", data);

    return data; 
  } catch (err) {
    logger.error(err);
    throw err; 
  }
}


if (require.main === module) {
  mainXML();
}
