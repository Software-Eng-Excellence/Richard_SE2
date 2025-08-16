import fs from 'fs';
import { parseStringPromise } from 'xml2js';
import logger from '../util/logger';

/**
 * Reads an XML file and converts it into a JS object.
 * @param filePath Path to the XML file
 * @returns Promise resolving to a JavaScript object
 */
export const parseXML = async (filePath: string): Promise<any> => {
  try {

    const data = await fs.promises.readFile(filePath, 'utf-8');

    
    const result = await parseStringPromise(data, { explicitArray: false });

    return result;
  } catch (error) {
   
    logger.error('Error parsing XML file %s: %o', filePath, error);
    throw error;
  }
};

