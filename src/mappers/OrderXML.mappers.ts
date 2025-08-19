import { IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";
import { OrderBuilder } from "../model/Builder/order.builder";
import { IItem } from "../model/IItem";

export class XMLOrderMapper implements IMapper<any, IOrder> {
    constructor(private itemMapper: IMapper<any, IItem>) {}

    map(data: any): IOrder {
        const item: IItem = this.itemMapper.map(data);

        const id = data.OrderID ?? "";
        const quantity = Number(data.Quantity ?? "0");
        const price = Number(data.Price ?? "0");

        return OrderBuilder.newBuilder()
            .setId(id)
            .setQuantity(quantity)
            .setPrice(price)
            .setItems(item)
            .build();
    }
}
