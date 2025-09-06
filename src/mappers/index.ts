import { ItemCategory } from "../model/IItem";
import { JsonIdentifiableCakeRequestMapper } from "./Cake.mappers";
import { JsonIdentifiableBookRequestMapper } from "./Book.mappers";
import { JsonIdentifiableToyRequestMapper } from "./Toy.mappers";
import { IMapper } from "./IMapper";
import { JsonRequestOrderMapper } from "./Order.mapper";

export class JsonRequestFactory{
    public static create(typeInput: string): IMapper<any, any> {
        // Convert to lowercase for case-insensitive matching
        const type = typeInput.toLowerCase();
        
        switch (type) {
            case ItemCategory.CAKE:
                return new JsonRequestOrderMapper(new JsonIdentifiableCakeRequestMapper());
            case ItemCategory.BOOK:
                return new JsonRequestOrderMapper(new JsonIdentifiableBookRequestMapper());
            case ItemCategory.TOY:
                return new JsonRequestOrderMapper(new JsonIdentifiableToyRequestMapper());
            default:
                throw new Error(`Unknown item category: ${typeInput}`);
        }
    }

}