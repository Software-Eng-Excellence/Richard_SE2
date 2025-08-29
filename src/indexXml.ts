import { XMLToyMapper } from "./mappers/Toy.mappers";
import { OrderXMLMapper } from "../src/mappers/OrderXML.mappers";
import { parseXML } from "./parsers/xmlParser";
import logger from "./util/logger";

async function mainXML() {
    try {
        const data = await parseXML("src/data/toy_orders.xml");
       
        const rows = Array.isArray(data.data.row) ? data.data.row : [data.data.row];

        const toyMapper = new XMLToyMapper();
        const orderMapper = new OrderXMLMapper(toyMapper);

       
       const orders = rows.map(orderMapper.map.bind(orderMapper));
        logger.info("List of orders: %o", orders);
    } catch (error) {
        logger.error("Failed to load or map orders: %o", error);
    }
}

mainXML();