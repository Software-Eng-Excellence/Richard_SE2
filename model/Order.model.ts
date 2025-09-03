import { Item } from "./item.model";

export interface IOrder{
    getItems(): Item;
    getPrice(): number;
    getQuantity(): number;
    getId(): string;

}

export class Order implements IOrder {
    private items: Item;
    private price: number;
    private quantity: number;
    private id: string;

    constructor(items: Item, price: number, quantity: number, id: string) {
        this.items = items;
        this.price = price;
        this.quantity = quantity;
        this.id = id;
    }

    getItems(): Item {
        return this.items;
    }

    getPrice(): number {
        return this.price;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getId(): string {
        return this.id;
    }
}           