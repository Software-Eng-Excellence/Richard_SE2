import { IdentifiableBook ,Book} from "../model/Book.models";
import { BookBuilder, IdentifiableBookBuilder } from "../model/Builder/book.builder";
import { CakeBuilder, IdentifiableCakeBuilder } from "../model/Builder/cake.builder";
import { Cake, IdentifiableCake } from "../model/Cake.model";
import { IMapper } from "./IMapper";

export class CSVCakeMapper implements IMapper<String[],Cake> {
    map(row: string[]): Cake {
        const [
             type, flavor, filling, size, layers, frostingType, frostingFlavor,
            decorationType, decorationColor, customMessage, shape, allergies,
           specialIngredients, packagingType
        ] = row;
        
        return CakeBuilder.newBuilder()
            
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
            .setAllergies(allergies)
            .setSpecialIngredients(specialIngredients)
            .setPackagingType(packagingType)
            .build();
    }
    reverse(data: Cake): string[] {

        return [
            // data.getId().toString(),
            data.getType(),
            data.getFlavor(),
            data.getFilling(),
            data.getSize().toString(),
            data.getLayers().toString(),
            data.getFrostingType(),
            data.getFrostingFlavor(),
            data.getDecorationType(),
            data.getDecorationColor(),
            data.getCustomMessage(),
            data.getShape(),
            data.getAllergies(),
            data.getSpecialIngredients(),
            data.getPackagingType(),
          
        ];
    }
}
export interface SQLiteCake{
    id:string;
    type:string;
    flavor:string;
    filling:string;
    size:number;
    layers:number;
    frostingType:string;
    frostingFlavor:string;
    decorationType:string;
    decorationColor:string;
    customMessage:string;
    shape:string;
    allergies:string;
    specialIngredients:string;
    packagingType:string;

}
export class SqliteCakeMapper implements IMapper<SQLiteCake, IdentifiableCake> {
    map(data: SQLiteCake): IdentifiableCake {
        return IdentifiableCakeBuilder.newBuilder()
        .setCake(CakeBuilder.newBuilder()
            .setType(data.type)
            .setFlavor(data.flavor)
            .setFilling(data.filling)
            .setSize(data.size)
            .setLayers(data.layers)
            .setFrostingType(data.frostingType)
            .setFrostingFlavor(data.frostingFlavor)
            .setDecorationType(data.decorationType)
            .setDecorationColor(data.decorationColor)
            .setCustomMessage(data.customMessage)
            .setShape(data.shape)
            .setAllergies(data.allergies)
            .setSpecialIngredients(data.specialIngredients)
            .setPackagingType(data.packagingType)
            .build())
        .setId(data.id)     
        .build();
    }

    reverse(data: IdentifiableCake): SQLiteCake {
        return {
            id: data.getId(),
            type: data.getType(),
            flavor: data.getFlavor(),
            filling: data.getFilling(),
            size: data.getSize(),
            layers: data.getLayers(),
            frostingType: data.getFrostingType(),
            frostingFlavor: data.getFrostingFlavor(),
            decorationType: data.getDecorationType(),
            decorationColor: data.getDecorationColor(),
            customMessage: data.getCustomMessage(),
            shape: data.getShape(),
            allergies: data.getAllergies(),
            specialIngredients: data.getSpecialIngredients(),
            packagingType: data.getPackagingType()
        };
    }
}



export interface PostgresCake {
    id: string;
    type: string;
    flavor: string;
    filling: string;
    size: number;
    layers: number;
    frostingType: string;
    frostingFlavor: string;
    decorationType: string;
    decorationColor: string;
    customMessage: string;
    shape: string;
    allergies: string;
    specialIngredients: string;
    packagingType: string;
}

export class PostgresCakeMapper implements IMapper<PostgresCake, IdentifiableCake> {
    map(data: PostgresCake | any): IdentifiableCake {
       
        
        return IdentifiableCakeBuilder.newBuilder()
            .setCake(CakeBuilder.newBuilder()
                .setType(data.type)
                .setFlavor(data.flavor)
                .setFilling(data.filling)
                .setSize(data.size)
                .setLayers(data.layers)
                .setFrostingType(data.frostingType || data.frostingtype)
                .setFrostingFlavor(data.frostingFlavor || data.frostingflavor)
                .setDecorationType(data.decorationType || data.decorationtype)
                .setDecorationColor(data.decorationColor || data.decorationcolor)
                .setCustomMessage(data.customMessage || data.custommessage)
                .setShape(data.shape)
                .setAllergies(data.allergies)
                .setSpecialIngredients(data.specialIngredients || data.specialingredients)
                .setPackagingType(data.packagingType || data.packagingtype)
                .build())
            .setId(data.id)     
            .build();
    }

    reverse(data: IdentifiableCake): PostgresCake {
        
        return {
            id: data.getId(),
            type: data.getType(),
            flavor: data.getFlavor(),
            filling: data.getFilling(),
            size: data.getSize(),
            layers: data.getLayers(),
            frostingType: data.getFrostingType(),
            frostingFlavor: data.getFrostingFlavor(),
            decorationType: data.getDecorationType(),
            decorationColor: data.getDecorationColor(),
            customMessage: data.getCustomMessage(),
            shape: data.getShape(),
            allergies: data.getAllergies(),
            specialIngredients: data.getSpecialIngredients(),
            packagingType: data.getPackagingType()
        };
    }
}





export class JsonIdentifiableCakeRequestMapper implements IMapper<any, IdentifiableCake> {
    map(data: any): IdentifiableCake {
        // Get data from nested item or from root object
        const itemData = data.item || data;
        
        // Log the itemData for debugging
        console.log("Mapping cake data:", JSON.stringify(itemData, null, 2));
        
        // Check for required fields
        // if (!itemData.type) {
        //     console.error("Missing required field 'type' in cake data");
        //     throw new Error("Cake type is required");
        // }
        
        // Generate an ID if none is provided
        const id = data.id || `cake-${Date.now()}`;
        
        // Apply default values for required fields to prevent NULL values
        return IdentifiableCakeBuilder.newBuilder()
            .setCake(CakeBuilder.newBuilder()
                .setType(itemData.type || "Standard") // Default value for type
                .setFlavor(itemData.flavor || "Vanilla") // Default value for flavor
                .setFilling(itemData.filling || "None") // Default value for filling
                .setSize(itemData.size || 8) // Default value for size
                .setLayers(itemData.layers || 1) // Default value for layers
                .setFrostingType(itemData.frostingType || "None") // Default value for frostingType
                .setFrostingFlavor(itemData.frostingFlavor || "None") // Default value for frostingFlavor
                .setDecorationType(itemData.decorationType || "None") // Default value for decorationType
                .setDecorationColor(itemData.decorationColor || "None") // Default value for decorationColor
                .setCustomMessage(itemData.customMessage || "") // Default value for customMessage
                .setShape(itemData.shape || "Round") // Default value for shape
                .setAllergies(itemData.allergies || "None") // Default value for allergies
                .setSpecialIngredients(itemData.specialIngredients || "None") // Default value for specialIngredients
                .setPackagingType(itemData.packagingType || "Standard") // Default value for packagingType
                .build())
            .setId(id)
            .build();
    }

    reverse(data: IdentifiableCake): any {
        return {
            id: data.getId(),
            type: data.getType(),
            flavor: data.getFlavor(),
            filling: data.getFilling(),
            size: data.getSize(),
            layers: data.getLayers(),
            frostingType: data.getFrostingType(),
            frostingFlavor: data.getFrostingFlavor(),
            decorationType: data.getDecorationType(),
            decorationColor: data.getDecorationColor(),
            customMessage: data.getCustomMessage(),
            shape: data.getShape(),
            allergies: data.getAllergies(),
            specialIngredients: data.getSpecialIngredients(),
            packagingType: data.getPackagingType()
        };
    }
}