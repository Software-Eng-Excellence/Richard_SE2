import { IIdentifiableItem, IItem } from "../IItem";
import { IIdentifiableOrderItem } from "../IOrder";
import { IdentifiableOrderItem, Order } from "../Order.model";
export class OrderBuilder{
    private items!: IItem;
    private price!: number;
    private quantity!: number ;
    private id!: string;
     
    public static newBuilder(): OrderBuilder {
        return new OrderBuilder();
    }

    setItems(items: IItem): OrderBuilder {
        this.items = items;
        return this;
    }

    setPrice(price: number): OrderBuilder {
        this.price = price;
        return this;
    }

    setQuantity(quantity: number): OrderBuilder {
        this.quantity = quantity;
        return this;
    }

    setId(id: string): OrderBuilder {
        this.id = id;
        return this;
    }

    build(): Order {
        const required=[
            this.items,
            this.price,
            this.quantity,
            this.id
        ];
  
        for (const prop of required) {
            if (prop === undefined || prop === null) {
                throw new Error("Missing required order property");
            }
        }

        return new Order(
            this.items,
            this.price,
            this.quantity,
            this.id
        );
    }
}

export class IdentifiableOrderItemBuilder{
    private items!: IIdentifiableItem;
    private order!: Order;
 
     
     static newBuilder(): IdentifiableOrderItemBuilder {
         return new IdentifiableOrderItemBuilder();
     }

     setItems(items: IIdentifiableItem): IdentifiableOrderItemBuilder {
         this.items = items;
         return this;
     }

     setOrder(order: Order): IdentifiableOrderItemBuilder {
         this.order = order;
         return this;
     }

     build(): IIdentifiableOrderItem {
         const required=[
             this.items,
             this.order
           
         ];
         for (const prop of required) {
             if (prop === undefined || prop === null) {
                 throw new Error("Missing required order property");
             }
         }

         return new IdentifiableOrderItem(
             this.items,
             this.order.getPrice(),
             this.order.getQuantity(),
             this.order.getId()
         );

     }

}