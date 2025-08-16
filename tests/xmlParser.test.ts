import { mainXML } from '../src/indexXml';
import logger from '../src/util/logger';

jest.mock('../src/util/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('mainXML function', () => {
  test('should parse XML file correctly', async () => {
    const data = await mainXML();

    expect(data).toHaveProperty('data.row');
    expect(Array.isArray(data.data.row)).toBe(true);
    expect(data.data.row.length).toBeGreaterThan(0);

    expect(logger.info).toHaveBeenCalled();
  });

  test('should log error if parsing fails', async () => {
   
    const parseXMLModule = require('../src/parsers/xmlParser');
    jest.spyOn(parseXMLModule, 'parseXML').mockRejectedValueOnce(new Error('XML parse failed'));

    await expect(mainXML()).rejects.toThrow('XML parse failed');

    expect(logger.error).toHaveBeenCalled();
  });
});
