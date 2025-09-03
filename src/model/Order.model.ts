import { IdentifiableCake } from "./Cake.model";
import { IIdentifiableItem, IItem } from "./IItem";
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
  getItem(): IItem {
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

export class IdentifiableOrderItem  implements IdentifiableOrderItem {
  private identifiableItem: IIdentifiableItem;
  private price: number;
  private quantity: number;
  private id: string;

  constructor( identifiableItem: IIdentifiableItem,  price: number , quantity: number,id:string) {
      this.price = price;
      this.quantity = quantity;
      this.id = id;
      this.identifiableItem = identifiableItem;
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
    
    getItem(): IIdentifiableItem {
        return this.identifiableItem;
    }
}