import { IIdentifiableItem, ItemCategory } from "../model/IItem";
import { IMapper } from "./IMapper";
import { CSVCakeMapper, PostgresCakeMapper, SqliteCakeMapper } from "./Cake.mappers";
import { JSONBookMapper } from "./Book.mappers";
import { XMLToyMapper } from "./Toy.mappers";

export enum MapperType {
    CSV,
    JSON,
    XML,
    SQLITE,
    POSTGRES
}

export class MapperFactory {
    /**
     * Creates a mapper for the specified item type and data source
     * @param mapperType Type of mapper (CSV, JSON, XML, SQLITE, POSTGRES)
     * @param category Category of item (CAKE, BOOK, TOY)
     * @returns An appropriate mapper instance
     */
    public static createMapper<T, R>(mapperType: MapperType, category: ItemCategory): IMapper<T, R> {
        switch (mapperType) {
            case MapperType.CSV:
                if (category === ItemCategory.CAKE) {
                    return new CSVCakeMapper() as unknown as IMapper<T, R>;
                }
                throw new Error("CSV mapper only available for CAKE");
            
            case MapperType.JSON:
                if (category === ItemCategory.BOOK) {
                    return new JSONBookMapper() as unknown as IMapper<T, R>;
                }
                throw new Error("JSON mapper only available for BOOK");
            
            case MapperType.XML:
                if (category === ItemCategory.TOY) {
                    return new XMLToyMapper() as unknown as IMapper<T, R>;
                }
                throw new Error("XML mapper only available for TOY");
            
            case MapperType.SQLITE:
                if (category === ItemCategory.CAKE) {
                    return new SqliteCakeMapper() as unknown as IMapper<T, R>;
                }
                throw new Error("SQLite mapper only available for CAKE");
            
            case MapperType.POSTGRES:
                if (category === ItemCategory.CAKE) {
                    return new PostgresCakeMapper() as unknown as IMapper<T, R>;
                }
                throw new Error("Postgres mapper only available for CAKE");
            
            default:
                throw new Error("Invalid mapper type");
        }
    }
}
