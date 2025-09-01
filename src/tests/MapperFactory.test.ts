import { ItemCategory } from "../model/IItem";
import { CSVCakeMapper, PostgresCakeMapper, SqliteCakeMapper } from "../mappers/Cake.mappers";
import { JSONBookMapper } from "../mappers/Book.mappers";
import { XMLToyMapper } from "../mappers/Toy.mappers";
import { MapperFactory, MapperType } from "../mappers/Mapper.factory";

describe('MapperFactory', () => {
  describe('createMapper', () => {
    it('should return CSVCakeMapper for CSV and CAKE', () => {
      const mapper = MapperFactory.createMapper(MapperType.CSV, ItemCategory.CAKE);
      expect(mapper).toBeInstanceOf(CSVCakeMapper);
    });

    it('should return JSONBookMapper for JSON and BOOK', () => {
      const mapper = MapperFactory.createMapper(MapperType.JSON, ItemCategory.BOOK);
      expect(mapper).toBeInstanceOf(JSONBookMapper);
    });

    it('should return XMLToyMapper for XML and TOY', () => {
      const mapper = MapperFactory.createMapper(MapperType.XML, ItemCategory.TOY);
      expect(mapper).toBeInstanceOf(XMLToyMapper);
    });

    it('should return SqliteCakeMapper for SQLITE and CAKE', () => {
      const mapper = MapperFactory.createMapper(MapperType.SQLITE, ItemCategory.CAKE);
      expect(mapper).toBeInstanceOf(SqliteCakeMapper);
    });

    it('should return PostgresCakeMapper for POSTGRES and CAKE', () => {
      const mapper = MapperFactory.createMapper(MapperType.POSTGRES, ItemCategory.CAKE);
      expect(mapper).toBeInstanceOf(PostgresCakeMapper);
    });

    it('should throw an error for invalid combinations', () => {
      expect(() => MapperFactory.createMapper(MapperType.CSV, ItemCategory.BOOK)).toThrow();
      expect(() => MapperFactory.createMapper(MapperType.JSON, ItemCategory.CAKE)).toThrow();
      expect(() => MapperFactory.createMapper(MapperType.XML, ItemCategory.BOOK)).toThrow();
      expect(() => MapperFactory.createMapper(MapperType.SQLITE, ItemCategory.TOY)).toThrow();
      expect(() => MapperFactory.createMapper(99 as any, ItemCategory.CAKE)).toThrow();
    });
  });
});
