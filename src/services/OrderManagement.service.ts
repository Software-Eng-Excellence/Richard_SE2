import { IdentifiableOrderItem, Order } from "../model/Order.model";
import { RepositoryFactory } from "../repository/Repository.factory";
import { ServiceException } from "../util/exceptions/ServiceException";
import config from "../config";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { ItemCategory } from "../model/IItem";
import { IRepository } from "../repository/IRepository";

export class OrderManagementService {
    // Service methods for order management
    public async createOrder(order:IdentifiableOrderItem): Promise<IdentifiableOrderItem> {

        //validation order
        if(!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
            this.validateOrder(order);
        } 
        //we use uuid beacuse we need to create id that are not duplicate
        //  and not autoIncrement to avoid the hacker can access our data via api easily
        //const id=generateUUID();
        //persist the order
        const repo = await this.getRepo(order.getItem().getCategory());
        repo.create(order);
        return order;
    }
    //Get Order
    public async getOrder(id:string ): Promise<IIdentifiableOrderItem> {
        const categories = Object.values(ItemCategory);
        for(const category of categories){
            const repo = await this.getRepo(category);
            const order = await repo.get(id);
            if(order) return order;
        }
        throw new ServiceException(`Order with id ${id} not found`);
       
    }
    //update Order
    public async updateOrder(order:IIdentifiableOrderItem): Promise<void> {
        //validate order
        if(!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
            this.validateOrder(order);
        }
        const repo = await this.getRepo(order.getItem().getCategory());
        repo.update(order);
    }
    //Delete Order
    public async deleteOrder(id:string, category:ItemCategory): Promise<void> {
       const categories = Object.values(ItemCategory);
       for(const category of categories){
           const repo = await this.getRepo(category);
           const order = await repo.get(id);
           if(order) {
                repo.delete(id);
               return;
           }
       }
       throw new ServiceException(`Order with id ${id} not found`);
    }

    //Get All Orders
    public async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
        const allorders: IIdentifiableOrderItem[] = [];
        const categories = Object.values(ItemCategory);
        for(const category of categories){
            const repo = await this.getRepo(category);
            const Orders = await repo.getAll();
            allorders.push(...Orders);
        }
        return allorders;
    }

    //get total revenue
    public async getTotalRevenue(): Promise<number> {
        const orders = await this.getAllOrders();
        return orders.reduce((total, order) => total + order.getPrice() * order.getQuantity(), 0);
    }
    //get total orders
    public async getTotalOrders(): Promise<number> {
        const orders = await this.getAllOrders();
        return orders.length;
    }



    
    private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        return RepositoryFactory.create(config.dbMode, category);
    }
    private validateOrder(order: IIdentifiableOrderItem): void {
       if(!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
           throw new ServiceException("Invalid order: item, price, and quantity must be valid");
       }
       
    }
}