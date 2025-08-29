import { parseJSON } from '../parsers/jsonParser';
import fs from 'fs';
import logger from '../util/logger';

jest.mock('../util/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('parseJSON', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should parse JSON and return data', async () => {
   
    const mockReadStream: any = {
      on: function (event: string, callback: Function) {
        if (event === 'data') {
          callback('{"val":1}');
        }
        if (event === 'end') {
          callback();
        }
        return this;
      }
    };
    jest.spyOn(fs, 'createReadStream').mockReturnValue(mockReadStream);

    const data = await parseJSON('dummy.json');
    expect(data).toEqual({ val: 1 });
  });

  it('should log error if parsing fails', async () => {
    const mockReadStream: any = {
      on: function (event: string, callback: Function) {
        if (event === 'data') {
          callback('invalid json');
        }
        if (event === 'end') {
          callback();
        }
        return this;
      }
    };
    jest.spyOn(fs, 'createReadStream').mockReturnValue(mockReadStream);

    await expect(parseJSON('bad.json')).rejects.toThrow();
    expect(logger.error).toHaveBeenCalled();
  });
});

