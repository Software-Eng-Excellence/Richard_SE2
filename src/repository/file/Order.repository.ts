import { IOrder } from "../../model/IOrder";
import { InvalidItemException, ItemNotFoundException } from "../../util/exceptions/repositoryException";
import logger from "../../util/logger";
import { id, IRepository } from "../IRepository";

export abstract  class OrderRepository implements IRepository<IOrder>{
    protected abstract load():Promise<IOrder[]>;

      
    protected abstract save(orders:IOrder[]):Promise<void>;

    async create(item: IOrder): Promise<id> {
        //validate the order
        if(!item){
            logger.error("Invalid order");
            throw new InvalidItemException("Order cannot be null");
        }
        //load all orders
        const orders = await this.load();
        //add the new order
        const id = orders.push(item);
        //save all order
        await this.save(orders);
        logger.info(`Order with id ${id} created successfully`);
        return String(id);
    }

    async get(id: id): Promise<IOrder> {
        const orders= await this.load();
        const foundOrder = orders.find(order => order.getId() === id);
        if (!foundOrder) {
            logger.error(`Order with id ${id} not found`);
            throw new ItemNotFoundException("Order not found");
        }
        logger.info(`Order with id ${id} retrieved successfully`);
        return foundOrder;
    }

    async getAll(): Promise<IOrder[]> {
        const orders = await this.load();
        logger.info(`All orders retrieved successfully %d`,orders.length);
        return orders;
    }

    async update(item: IOrder): Promise<void> {
        if(!item){
            logger.error("Order cannot be null");
            throw new InvalidItemException("Order cannot be null"); 
        }
        const orders = await this.load();
        const index = orders.findIndex(order => order.getId() === item.getId());
        if (index === -1) {
            logger.error(`Order with id ${item.getId()} not found`);
            throw new ItemNotFoundException("Order not found");
        }
        orders[index] = item;
        await this.save(orders);

    }

    async delete(id: id): Promise<void> {
        if(!id){
            logger.error("Order id cannot be null");
            throw new InvalidItemException("Order id cannot be null");
        }
        const orders = await this.load();
        const index = orders.findIndex(order => order.getId() === id);
        if (index === -1) {
            logger.error(`Order with id ${id} not found`);
            throw new ItemNotFoundException("Order not found");
        }
        orders.splice(index, 1);
        await this.save(orders);
        logger.info(`Order with id ${id} deleted successfully`);
    }
}