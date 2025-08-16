import { Item, ItemCategory } from "./item.model";
//type Type = "birthday" | "wedding" | "anniversary" | "custom";
//type is ts is same as enum in java that define withy only type i needed for this object
//enum in
export class CAKE implements Item {
  
    constructor(
        id: number,
        type: string,
        flavor: string,
        filling: string,
        size: string,
        layers: number,
        frostingType: string,
        frostingFlavor: string,
        decoration: string,
        notes: string
    ) {
        this.id = id;
        this.type = type;
        this.flavor = flavor;
        this.filling = filling;
        this.size = size;
        this.layers = layers;
        this.frostingType = frostingType;
        this.frostingFlavor = frostingFlavor;
        this.decoration = decoration;
        this.notes = notes;
    }
    private id: number;
    private type: string;
    private flavor: string;
    private filling: string;
    private size: string;
    private layers: number;
    private frostingType: string;
    private frostingFlavor: string;
    private decoration: string;
    private notes: string;
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

    getSize(): string {
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

    getDecoration(): string {
        return this.decoration;
    }

    getNotes(): string {
        return this.notes;
    }
}   