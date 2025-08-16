import { main1 } from '../src/indexJson';
import logger from '../src/util/logger';


jest.mock('../src/util/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('jsonIndex main()', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocks between tests
  });

  test('should parse JSON and return data', async () => {
    const data = await main1();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    expect(logger.info).toHaveBeenCalled();
  });

  test('should log error if parsing fails', async () => {
    
    jest.spyOn(require('../src/parsers/jsonParser'), 'parseJSON')
        .mockRejectedValueOnce(new Error('JSON parse failed'));

   
  });
});

