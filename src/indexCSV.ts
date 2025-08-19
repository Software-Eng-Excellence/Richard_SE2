import { CSVCakeMapper } from "./mappers/Cake.mappers";
import { CSVOrderMapper } from "./mappers/Order.mapper";
import { parseCSV } from "./parsers/csvParser";
import logger from "./util/logger";

export async function main() {
    try {
        const data = await parseCSV("src/cake_orders.csv");
        //const header = data.shift(); // remove header row
        const Cakemapper = new CSVCakeMapper();
        const orderMapper = new CSVOrderMapper(Cakemapper);
        const orders = data.map(r=> orderMapper.map(r));

        logger.info("List of orders: %o", orders);
    } catch (error) {
        logger.error("Failed to load or map orders: %o", error);
    }
}
if (require.main === module) {
    main();
}