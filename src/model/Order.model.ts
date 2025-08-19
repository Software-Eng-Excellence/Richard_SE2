import { IItem } from "./IItem";
import { IOrder } from "./IOrder";



export class Order implements IOrder {
    private items: IItem;
    private price: number;
    private quantity: number;
    private id: string;
  constructor(
     items: IItem,
     price: number,
     quantity: number,
     id: string
  ) {
    this.items = items;
    this.price = price;
    this.quantity = quantity;
    this.id = id;
  }

  getItems(): IItem {
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