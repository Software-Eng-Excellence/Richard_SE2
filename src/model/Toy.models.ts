import { id } from "../repository/IRepository";
import { IIdentifiableItem, IItem, ItemCategory } from "./IItem";



export class Toy implements IItem {


    private orderID: number;
    private type: string;
    private ageGroup: number;
    private brand: string;
    private material: string;
    private batteryRequired: boolean;
    private educational: boolean;
    private price: number;
    private quantity: number;

    constructor(orderID: number, type: string, ageGroup: number, brand: string, material: string, batteryRequired: boolean, educational: boolean, price: number, quantity: number) {
        this.orderID = orderID;
        this.type = type;
        this.ageGroup = ageGroup;
        this.brand = brand;
        this.material = material;
        this.batteryRequired = batteryRequired;
        this.educational = educational;
        this.price = price;
        this.quantity = quantity;
    }
    getCategory(): ItemCategory {
        return ItemCategory.TOY;
    }
    getOrderID(): number {
        return this.orderID;
    }
    getType(): string {
        return this.type;
    }
    getAgeGroup(): number {
        return this.ageGroup;
    }
    getBrand(): string {
        return this.brand;
    }
    getMaterial(): string {
        return this.material;
    }
    isBatteryRequired(): boolean {
        return this.batteryRequired;
    }
    isEducational(): boolean {
        return this.educational;
    }
    getPrice(): number {
        return this.price;
    }
    getQuantity(): number {
        return this.quantity;
    }

}
export class IdentifiableToy implements IIdentifiableItem{
    constructor(private id:id, private item:IItem) {
    }
    getCategory(): ItemCategory {
        throw new Error("Method not implemented.");
    }
    getItem(): IItem {
        return this.item
    }
    getId(): id {
        return this.id
    }
}
