import { IItem } from "../IItem";
import { IOrder } from "../IOrder";
import { Order } from "../Order.model";
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

    build(): IOrder {
        const required=[
            this.items,
            this.price,
            this.quantity,
            this.id
        ];
        // if(!this.items || !this.price || !this.quantity || !this.id){
        //     throw new Error("Missing required Order fields");
        // }
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
        )
    }
}