import { main } from '../src/indexCSV';
import logger from '../src/util/logger';


jest.mock('../src/util/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

describe('index.ts main()', () => {
  test('should parse CSV and return products', async () => {
    const products = await main();

   
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

 
  });

  test('should log error if parsing fails', async () => {
   
    jest.spyOn(require('../src/parsers/csvParser'), 'parseCSV')
        .mockRejectedValueOnce(new Error('CSV parse failed'));

    await expect(main()).rejects.toThrow('CSV parse failed');
    expect(logger.error).toHaveBeenCalled();
  });
});
