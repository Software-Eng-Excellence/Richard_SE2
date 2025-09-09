import { ItemCategory } from "../model/IItem";
import { JsonIdentifiableCakeRequestMapper, PostgresCakeMapper, SqliteCakeMapper } from "./Cake.mappers";
import { JsonIdentifiableBookRequestMapper, PostgresBookMapper } from "./Book.mappers";
import { JsonIdentifiableToyRequestMapper, PostgresToyMapper } from "./Toy.mappers";
import { IMapper } from "./IMapper";
import { JsonRequestOrderMapper } from "./Order.mapper";
import { DBMode } from "../config/type";

export class JsonRequestFactory{
    public static create(itemCategory: ItemCategory, dbMode: DBMode): IMapper<any, any> {
        switch(dbMode) {
            case DBMode.FILE:
               switch(itemCategory) {
                   case ItemCategory.CAKE:
                       return new JsonRequestOrderMapper(new JsonIdentifiableCakeRequestMapper());
                     case ItemCategory.BOOK:
                       return new JsonRequestOrderMapper(new JsonIdentifiableBookRequestMapper());
                   case ItemCategory.TOY:
                       return new JsonRequestOrderMapper(new JsonIdentifiableToyRequestMapper());
               }

            case DBMode.SQLITE:
                switch(itemCategory) {
                    case ItemCategory.CAKE:
                        return new JsonRequestOrderMapper(new SqliteCakeMapper());
                    case ItemCategory.BOOK:
                      //  return new JsonRequestOrderMapper(new SqliteBookMapper());
                    case ItemCategory.TOY:
                        //return new JsonRequestOrderMapper(new SqliteToyMapper());
                }
                
            case DBMode.POSTGRES:
                switch(itemCategory) {
                    case ItemCategory.CAKE:
                        return new JsonRequestOrderMapper(new PostgresCakeMapper());
                    case ItemCategory.BOOK:
                        return new JsonRequestOrderMapper(new PostgresBookMapper());
                    case ItemCategory.TOY:
                        return new JsonRequestOrderMapper(new PostgresToyMapper());
                    default:
                        throw new Error(`Unknown item category: ${itemCategory}`);
                }
            default:
                throw new Error(`Unsupported DB mode: ${dbMode}`);
        }
    }

}