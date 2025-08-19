import { CakeBuilder } from "../model/Builder/cake.builder";
import { Cake } from "../model/Cake.model";
import { IMapper } from "./IMapper";

export class CSVCakeMapper implements IMapper<String[],Cake> {
    map(row: string[]): Cake {
        const [
            id, type, flavor, filling, size, layers, frostingType, frostingFlavor,
            decorationType, decorationColor, customMessage, shape, Allergies,
            SpecialIngredients, PackagingType, price, quantity
        ] = row;
        
        return CakeBuilder.newBuilder()
            .setId(Number(id))
            .setType(type)
            .setFlavor(flavor)
            .setFilling(filling)
            .setSize(Number(size))
            .setLayers(Number(layers))
            .setFrostingType(frostingType)
            .setFrostingFlavor(frostingFlavor)
            .setDecorationType(decorationType)
            .setDecorationColor(decorationColor)
            .setCustomMessage(customMessage)
            .setShape(shape)
            .setAllergies(Allergies)
            .setSpecialIngredients(SpecialIngredients)
            .setPackagingType(PackagingType)
            .setPrice(Number(price))
            .setQuantity(Number(quantity))
            .build();
    }
}
