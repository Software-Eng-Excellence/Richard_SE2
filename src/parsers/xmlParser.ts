import fs from 'fs';
import { parseStringPromise } from 'xml2js';
import logger from '../util/logger';

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

