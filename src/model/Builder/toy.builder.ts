import {Toy} from "../Toy.models";

export class ToyBuilder {
    private orderID!: number;
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

    setOrderID(orderID: number): ToyBuilder {
        this.orderID = orderID;
        return this;
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
            'orderID',
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
            this.orderID,
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