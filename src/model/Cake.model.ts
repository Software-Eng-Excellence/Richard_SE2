import { IItem, ItemCategory } from "./IItem";
//type Type = "birthday" | "wedding" | "anniversary" | "custom";
//type is ts is same as enum in java that define which only type i needed for this object

export class Cake implements IItem {
  
    constructor(
        id: number,
        type: string,
        flavor: string,
        filling: string,
        size: number,
        layers: number,
        frostingType: string,
        frostingFlavor: string,
        decorationType: string,
        decorationColor: string,
        customMessage: string,
        shape:string,
        Allergies: string,
        SpecialIngredients: string,
        PackagingType: string,
        price: number,
        quantity: number
    ) {
        this.id = id;
        this.type = type;
        this.flavor = flavor;
        this.filling = filling;
        this.size = size;
        this.layers = layers;
        this.frostingType = frostingType;
        this.frostingFlavor = frostingFlavor;
        this.decorationType = decorationType;
        this.decorationColor = decorationColor;
        this.customMessage = customMessage;
        this.shape = shape;
        this.Allergies = Allergies;
        this.SpecialIngredients = SpecialIngredients;
        this.PackagingType = PackagingType;
        this.price = price;
        this.quantity = quantity;
    }
     
    private id: number;
    private type: string;
    private flavor: string;
    private filling: string;
    private size: number;
    private layers: number;
    private frostingType: string;
    private frostingFlavor: string;
    private decorationType: string;
    private decorationColor: string;
    private customMessage: string;
    private shape: string;
    private Allergies: string;
    private SpecialIngredients: string;
    private PackagingType: string;
    private price: number;
    private quantity: number;

    getCategory(): ItemCategory {
        return ItemCategory.CAKE;
    }

    getId(): number {
        return this.id;
    }

    getType(): string {
        return this.type;
    }

    getFlavor(): string {
        return this.flavor;
    }

    getFilling(): string {
        return this.filling;
    }

    getSize(): number {
        return this.size;
    }

    getLayers(): number {
        return this.layers;
    }

    getFrostingType(): string {
        return this.frostingType;
    }

    getFrostingFlavor(): string {
        return this.frostingFlavor;
    }

    
    getDecorationType(): string {
        return this.decorationType;
    }

    getDecorationColor(): string {
        return this.decorationColor;
    }

    getCustomMessage(): string {
        return this.customMessage;
    }

    getShape(): string {
        return this.shape;
    }

    getAllergies(): string {
        return this.Allergies;
    }

    getSpecialIngredients(): string {
        return this.SpecialIngredients;
    }

    getPackagingType(): string {
        return this.PackagingType;
    }
    getPrice(): number {
        return this.price;
    }
    getQuantity(): number {
        return this.quantity;
    }

}