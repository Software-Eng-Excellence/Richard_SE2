import fs from 'fs'; 
import logger from '../util/logger';

export const parseCSV = (filePath: string): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const results: string[][] = [];
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    readStream.on('data', (chunk: any) => {
     
      const lines = chunk.split('\n').filter((line: string) => line.trim() !== ''); 
      lines.forEach((line:string) => {
        const columns = line.split(',').map(value => value.trim().replace(/^"(.*)"$/, '$1')); 
     
        results.push(columns); 
      });
    });

    readStream.on('end', () => {
      resolve(results); 
    });

    readStream.on('error', (error) => {
      logger.error("Error while reading the stream of file %s, $o", filePath, error);
      reject(error); 
    });
  });
};