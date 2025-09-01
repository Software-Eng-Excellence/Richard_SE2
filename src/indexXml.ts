import { XMLToyMapper } from "./mappers/Toy.mappers";
import { OrderXMLMapper } from "../src/mappers/OrderXML.mappers";
import { parseXML } from "./parsers/xmlParser";
import logger from "./util/logger";
import { OrderRepository } from "./repository/file/Order.repository";
import { ToyOrderRepository } from "./repository/Postgres/Toy.Order.repository";
import { IdentifiableToyBuilder, ToyBuilder } from "./model/Builder/toy.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/Builder/order.builder";
import { OrderRepositoryPostgres } from "./repository/Postgres/Order.repository";

// async function mainXML() {
//     try {
//         const data = await parseXML("src/data/toy_orders.xml");
       
//         const rows = Array.isArray(data.data.row) ? data.data.row : [data.data.row];

//         const toyMapper = new XMLToyMapper();
//         const orderMapper = new OrderXMLMapper(toyMapper);

       
//        const orders = rows.map(orderMapper.map.bind(orderMapper));
//         logger.info("List of orders: %o", orders);
//     } catch (error) {
//         logger.error("Failed to load or map orders: %o", error);
//     }
// }

// mainXML();
export async function DBMode() {
    const dbOrder = new OrderRepositoryPostgres(new ToyOrderRepository());
    await dbOrder.init();

    // Create your toy and order objects as before
    const toyId = `toy-${Math.random().toString(36).substr(2, 9)}`;
    const orderId = `order-${Math.random().toString(36).substr(2, 9)}`;
    const toy = ToyBuilder.newBuilder()
        .setType("Action Figure")
        .setAgeGroup(18)
        .setBrand("Hasbro")
        .setMaterial("Plastic")
        .setBatteryRequired(false)
        .setEducational(false)
        .setPrice(19.99)
        .setQuantity(1) 
        .build();

    const idToy = IdentifiableToyBuilder.newBuilder().setToy(toy).setId(toyId).build();

    const order = OrderBuilder.newBuilder()
        .setItems(idToy)
        .setPrice(19)
        .setQuantity(1)
        .setId(orderId)
        .build();
    const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItems(idToy).setOrder(order).build();

    // Add the order to Postgres
    await dbOrder.create(idOrder);
    console.log(await dbOrder.get(idOrder.getId()));

}
// Call the function
DBMode();