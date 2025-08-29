import { IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";
import { OrderBuilder } from "../model/Builder/order.builder";
import { IItem } from "../model/IItem";

export class OrderXMLMapper implements IMapper<XMLDocument, IOrder> {
    constructor(private itemMapper: IMapper<XMLDocument, IItem>) {}
    
    map(data: XMLDocument): IOrder {
        const id = data.getElementsByTagName("Id")[0]?.textContent || "";
        const quantity = Number(data.getElementsByTagName("Quantity")[0]?.textContent || "0");
        const price = Number(data.getElementsByTagName("Price")[0]?.textContent || "0");
        const item = this.itemMapper.map(data); // Pass the whole document
        
        return OrderBuilder.newBuilder()
            .setId(id)
            .setQuantity(quantity)
            .setPrice(price)
            .setItems(item)
            .build();
    }
    
    reverse(data: IOrder): XMLDocument {
        const xmlString = `
            <Order>
                <Id>${data.getId()}</Id>
                <Quantity>${data.getQuantity()}</Quantity>
                <Price>${data.getPrice()}</Price>
                <Item>${this.itemMapper.reverse(data.getItem())}</Item>
            </Order>`;
                    
        const parser = new DOMParser();
        return parser.parseFromString(xmlString, "application/xml");
    }
}