import fs from 'fs';
import logger from '../util/logger';

export const parseJSON = (filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    let data = '';
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    readStream.on('data', (chunk: string | Buffer) => {
      data += typeof chunk === 'string' ? chunk : chunk.toString('utf-8');
    });

    readStream.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        resolve(parsed);
      } catch (err) {
        logger.error("Error parsing JSON in %s: %o", filePath, err);
        reject(err);
      }
    });

    readStream.on('error', (err) => {
      logger.error("Error reading file %s: %o", filePath, err);
      reject(err);
    });
  });
};
