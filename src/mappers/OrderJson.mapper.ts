import { IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";
import { OrderBuilder } from "../model/Builder/order.builder";
import { IItem } from "../model/IItem";

export class JSONOrderMapper implements IMapper<object, IOrder> {
    constructor(private itemMapper: IMapper<object, IItem>) {}
    
    map(data: object): IOrder {
        const item: IItem = this.itemMapper.map(data);
        
        return OrderBuilder.newBuilder()
            .setId(String((data as any).id))
            .setQuantity(Number((data as any).quantity))
            .setPrice(Number((data as any).price))
            .setItems(item)
            .build();
    }

    reverse(data: IOrder): object {
        const orderData = {
            id: data.getId(),
            quantity: data.getQuantity(),
            price: data.getPrice()
        };
        
        const itemData = this.itemMapper.reverse(data.getItems());
        return { ...orderData, ...itemData };
    }
}