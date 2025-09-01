import { id } from "../../repository/IRepository";
import {Toy} from "../Toy.models";
import { IdentifiableToy } from "../Toy.models";
export class ToyBuilder {

    private type!: string;
    private ageGroup!: number;
    private brand!: string;
    private material!: string;
    private batteryRequired!: boolean;
    private educational!: boolean;
    private price!: number;
    private quantity!: number;

    public static newBuilder(): ToyBuilder {
        return new ToyBuilder();
    }

   

    setType(type: string): ToyBuilder {
        this.type = type;
        return this;
    }

    setAgeGroup(ageGroup: number): ToyBuilder {
        this.ageGroup = ageGroup;
        return this;
    }

    setBrand(brand: string): ToyBuilder {
        this.brand = brand;
        return this;
    }

    setMaterial(material: string): ToyBuilder {
        this.material = material;
        return this;
    }

    setBatteryRequired(batteryRequired: boolean): ToyBuilder {
        this.batteryRequired = batteryRequired;
        return this;
    }

    setEducational(educational: boolean): ToyBuilder {
        this.educational = educational;
        return this;
    }

    setPrice(price: number): ToyBuilder {
        this.price = price;
        return this;
    }

    setQuantity(quantity: number): ToyBuilder {
        this.quantity = quantity;
        return this;
    }

    build(): Toy {
        const requiredKeys = [
        
            'type',
            'ageGroup',
            'brand',
            'material',
            'batteryRequired',
            'educational',
            'price',
            'quantity',
        ] as const;

        const missing = requiredKeys.filter((k) => (this as any)[k] === undefined);

        if (missing.length) {
            throw new Error(`Cannot build Toy. Missing properties: ${missing.join(', ')}`);
        }

        return new Toy(
         
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational,
            this.price,
            this.quantity
        );
    }
}
export class IdentifiableToyBuilder extends ToyBuilder{
    private id!: id;
    private toy!: Toy;

    static newBuilder(): IdentifiableToyBuilder {
        return new IdentifiableToyBuilder();
    }

    setId(id: id): IdentifiableToyBuilder {
        this.id = id;
        return this;
    }
    setToy(toy: Toy): IdentifiableToyBuilder {
        this.toy = toy;
        return this;
    }

    build(): IdentifiableToy {
        if(!this.toy || !this.id){
            throw new Error("Missing required toy properties");
        }
        return new IdentifiableToy(
            this.id,
            this.toy.getType(),
            this.toy.getAgeGroup(),
            this.toy.getBrand(),
            this.toy.getMaterial(),
            this.toy.getBatteryRequired(),
            this.toy.getEducational(),
            this.toy.getPrice(),
            this.toy.getQuantity()
        );
    }
}