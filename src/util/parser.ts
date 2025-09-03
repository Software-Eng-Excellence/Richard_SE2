import fs from 'fs';
import logger from './logger';

export const readCSVFile = (filePath: string): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const results: string[][] = [];
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    let leftover = '';

    readStream.on('data', (chunk: string | Buffer) => {
      const data: string = typeof chunk === 'string' ? chunk : chunk.toString('utf-8');
      const lines: string[] = (leftover + data).split('\n');
      leftover = lines.pop() || '';

      lines.forEach((line: string) => {
        if (line.trim()) {
          const columns: string[] = line.split(',').map((value: string) => value.trim().replace(/^"(.*)"$/, '$1'));
          results.push(columns);
        }
      });
    });

    readStream.on('end', () => {
      if (leftover.trim()) {
        const columns: string[] = leftover.split(',').map((value: string) => value.trim().replace(/^"(.*)"$/, '$1'));
        results.push(columns);
      }
      resolve(results);
    });

    readStream.on('error', (error) => {
      logger.error("Error while reading the stream of file %s: %o", filePath, error);
      reject(error);
    });
  });
};
