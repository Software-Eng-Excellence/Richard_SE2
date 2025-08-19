import { parseXML } from '../parsers/xmlParser';
import fs from 'fs';

describe('parseXML', () => {
  it('parses XML file into JS object', async () => {
    const xmlString = `
    <data>
      <row>
        <OrderID>1</OrderID>
        <Type>Car</Type>
      </row>
    </data>`;
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(xmlString);

    const result = await parseXML('test.xml');
    expect(result.data.row.OrderID).toBe('1');
    expect(result.data.row.Type).toBe('Car');
  });
});