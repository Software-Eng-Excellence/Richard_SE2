import { IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";
import { OrderBuilder } from "../model/Builder/order.builder";
import { IItem } from "../model/IItem";

export class JSONOrderMapper implements IMapper<JSON, IOrder> {
    constructor(private itemMapper: IMapper<JSON, IItem>) {}

    map(data: JSON): IOrder {
        const item: IItem = this.itemMapper.map(data);

        // If "data" is already the JSON object loaded from file, you can access its properties directly:
        return OrderBuilder.newBuilder()
            .setId(String((data as any).id))
            .setQuantity(Number((data as any).quantity))
            .setPrice(Number((data as any).price))
            .setItems(item)
            .build();
    }
}
