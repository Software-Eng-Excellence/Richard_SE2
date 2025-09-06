import { IdentifiableOrderItem} from "../model/Order.model";
import { RepositoryFactory } from "../repository/Repository.factory";
import { ServiceException } from "../util/exceptions/ServiceException";
import config from "../config";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { ItemCategory } from "../model/IItem";
import { IRepository } from "../repository/IRepository";
import logger from "../util/logger";

export class OrderManagementService {
     private readonly activeCategories: ItemCategory[] = [ItemCategory.CAKE,ItemCategory.BOOK,ItemCategory.TOY];
    // Service methods for order management

    public async createOrder(order:IdentifiableOrderItem): Promise<IdentifiableOrderItem> {
        try {
            //validation order
            if(!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
                this.validateOrder(order);
            } 
            //we use uuid beacuse we need to create id that are not duplicate
            //  and not autoIncrement to avoid the hacker can access our data via api easily
            //const id=generateUUID();
            
            //persist the order
            if (!order.getItem().getCategory()) {
                throw new ServiceException("Item category is required");
            }
            
            const repo = await this.getRepo(order.getItem().getCategory());
            await repo.create(order);
            return order;
        } catch (error) {
            if (error instanceof ServiceException) {
                throw error;
            }
            throw new ServiceException(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    //Get Order
    public async getOrder(id:string): Promise<IIdentifiableOrderItem> {
        const categories = Object.values(ItemCategory);
       
        
        for(const category of categories){
            try{
                const repo = await this.getRepo(category);
                const order = await repo.get(id);
                if (order) {
                    return order;
                }
            }
            catch (error) {
            
                logger.debug(`No order with id ${id} in category ${category}`);
            }
        }
        
        logger.error(`Order with id ${id} not found in any category`);
        throw new ServiceException(`Order with id ${id} not found`);
    }
    //update Order
    public async updateOrder(order:IIdentifiableOrderItem): Promise<IIdentifiableOrderItem> {
        try {
            //validate order
            if(!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
                this.validateOrder(order);
            }
            
            // Check if the order exists in any repository
            let existingOrder = null;
            try {
                existingOrder = await this.getOrder(order.getId());
                logger.info(`Found existing order with id ${order.getId()} in category ${existingOrder.getItem().getCategory()}`);
            } catch (error) {
                logger.error(`Order with id ${order.getId()} not found for update`, error);
                throw new ServiceException(`Order with id ${order.getId()} not found`);
            }
            
            // Use the category from the order being updated
            const category = order.getItem().getCategory();
            logger.info(`Updating order with id ${order.getId()} in category ${category}`);
            
            try {
                const repo = await this.getRepo(category);
                await repo.update(order);
                logger.info(`Successfully updated order with id ${order.getId()}`);
                
                // Return the updated order
                return order;
            } catch (error) {
                logger.error(`Error in repository update for order ${order.getId()}:`, error);
                throw new ServiceException(`Repository error updating order: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        } catch (error) {
            if (error instanceof ServiceException) {
                throw error;
            }
            logger.error(`Unexpected error updating order with id ${order.getId()}:`, error);
            throw new ServiceException(`Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    //Delete Order
    public async deleteOrder(id:string, category:ItemCategory): Promise<void> {
       const categories = Object.values(ItemCategory);
       for(const category of categories){
           const repo = await this.getRepo(category);
           const order = await repo.get(id);
           if(order) {
               await  repo.delete(id);
               return;
           }
       }
       throw new ServiceException(`Order with id ${id} not found`);
    }

    //Get All Orders
    public async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
        const allorders: IIdentifiableOrderItem[] = [];
         
        for(const category of this.activeCategories){
            try {
                const repo = await this.getRepo(category);
                const Orders = await repo.getAll();
                logger.info(`Fetched ${Orders.length} orders from category ${category}`);
                allorders.push(...Orders);
            } catch (error) {
                logger.error(`Error fetching orders for category ${category}:`, error);
                // Continue with other categories instead of failing completely
            }
        }
        return allorders;
    }




    
    private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        try {
            const repository = await RepositoryFactory.create(config.dbMode, category);
            return repository;
        } catch (error) {
            logger.error(`Error creating repository for category ${category}:`, error);
            throw new ServiceException(`Failed to create repository for category ${category}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    
    private validateOrder(order: IIdentifiableOrderItem): void {
       if(!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
           throw new ServiceException("Invalid order: item, price, and quantity must be valid");
       }
    }
}