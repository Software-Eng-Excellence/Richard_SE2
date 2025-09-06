import { IIdentifiableOrderItem, IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";
import {IdentifiableOrderItemBuilder, OrderBuilder} from "../model/Builder/order.builder";
import { IIdentifiableItem, IItem } from "../model/IItem";
import { IdentifiableOrderItem } from "../model/Order.model";

export class CSVOrderMapper implements IMapper<string[],IOrder>{
   
    constructor(private itemMapper: IMapper<string[], IItem>) {

        }  

    map(data: string[]): IOrder {
        const item:IItem = this.itemMapper.map(data);
         
         
        return OrderBuilder.newBuilder()
            .setId(data[0])
            .setQuantity(parseInt(data[data.length-1]))
            .setPrice(parseFloat(data[data.length-2]))
            .setItems(item)
            .build();
    }
    reverse(data:IOrder): string[] {
        const itemData = this.itemMapper.reverse(data.getItem());
        return [
            data.getId(),
            ...itemData,
            data.getPrice().toString(),
            data.getQuantity().toString()
        ];
    }
}

export interface SQLiteOrder{
    id:string;
    item_category:string;
    item_id:string;
    price:number;
    quantity:number;
}

export class SQLiteOrderMapper implements IMapper<{data:SQLiteOrder,item:IIdentifiableItem}, IIdentifiableOrderItem>{

   

   map({data,item}: {data:SQLiteOrder,item:IIdentifiableItem}): IIdentifiableOrderItem {
        const order=OrderBuilder.newBuilder().setId(data.id)
        .setPrice(data.price)
        .setQuantity(data.quantity)
        .setItems(item)
        .build();
        return IdentifiableOrderItemBuilder.newBuilder().setOrder(order).setItems(item).build();
    }




    
    reverse(data:IIdentifiableOrderItem): {data:SQLiteOrder,item:IIdentifiableItem}{
       return{
           data: {
               id: data.getId(),
               item_category: data.getItem().getCategory(),
               item_id: data.getItem().getId(),
               price: data.getPrice(),
               quantity: data.getQuantity()
           },
           item: data.getItem()
       }
    }
}


export interface PostgresOrder{
    id:string;
    item_category:string;
    item_id:string;
    price:number;
    quantity:number;
}

export class PostgresOrderMapper implements IMapper<{data:PostgresOrder,item:IIdentifiableItem}, IIdentifiableOrderItem>{

   map({data,item}: {data:PostgresOrder,item:IIdentifiableItem}): IIdentifiableOrderItem {
        const order=OrderBuilder.newBuilder().setId(data.id)
        .setPrice(data.price)
        .setQuantity(data.quantity)
        .setItems(item)
        .build();
        return IdentifiableOrderItemBuilder.newBuilder().setOrder(order).setItems(item).build();
    }
    
    reverse(data:IIdentifiableOrderItem): {data:PostgresOrder,item:IIdentifiableItem}{
       return{
           data: {
               id: data.getId(),
               item_category: data.getItem().getCategory(),
               item_id: data.getItem().getId(),
               price: data.getPrice(),
               quantity: data.getQuantity()
           },
           item: data.getItem()
       }
    }
}

export class JsonRequestOrderMapper implements IMapper<any,IdentifiableOrderItem>{
     constructor(private readonly itemMapper: IMapper<any,IIdentifiableItem>){}
     
   map(data: any): IdentifiableOrderItem {
       // Map the item using the appropriate mapper
       const item = this.itemMapper.map(data);
       
       // Generate an ID if none is provided
       const id = data.id || `order-${Date.now()}`;
       
       // Build the order with all available data
       const order = OrderBuilder.newBuilder()
           .setId(id)
           .setPrice(data.price || 0)
           .setQuantity(data.quantity || 1)
           .setItems(item)
           .build();

       return IdentifiableOrderItemBuilder.newBuilder().setOrder(order).setItems(item).build();
   }

   reverse(data: IdentifiableOrderItem): any {
       return {
           category: data.getItem().getCategory(),
           ...data
       };
   }
}