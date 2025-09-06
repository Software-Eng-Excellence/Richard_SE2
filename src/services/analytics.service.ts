import { ItemNotFoundException } from "../util/exceptions/repositoryException";
import config from "../config";
import { ItemCategory } from "../model/IItem";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { IRepository } from "../repository/IRepository";
import { RepositoryFactory } from "../repository/Repository.factory";

export class AnalyticsService {

    /**
     * only categories implemented in the SQLITE DB
     */
    private readonly activeCategories: ItemCategory[] = [ItemCategory.CAKE, ItemCategory.TOY];

    private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        return RepositoryFactory.create(config.dbMode, category);
    }

    public async getTotalRevenue(): Promise<number> {
        let total = 0;
        for (const category of this.activeCategories) {
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
    
            for (const order of orders) {
                total += order.getPrice() * order.getQuantity();
            }
        }
    
        return total;
    }

    public async getRevenueByCategory(category: ItemCategory): Promise<number> {
        const repo = await this.getRepo(category);
        // get all orders in this category
        const orders = await repo.getAll();
        if(!orders || orders.length === 0) {
            throw new ItemNotFoundException("No orders found in category: " + category);
        }
        const revenues = orders.map(order => order.getPrice() * order.getQuantity());
        let total = 0;
        for (const revenue of revenues) {
            total += revenue;
        }
        return total;
    }


    public async getTotalOrderCount(): Promise<number> {
        const categories = Object.values(ItemCategory);
        let totalCount = 0;
      
        for (const category of this.activeCategories) {
          const repo = await this.getRepo(category);
          const orders = await repo.getAll();
          totalCount += orders.length; 
        }
        return totalCount;
      }


    public async getOrderCountsByCategory(category: ItemCategory): Promise<number> {
        const repo = await this.getRepo(category);
        const count = await repo.getAll();
        if(!count || count.length === 0) {
            throw new ItemNotFoundException("No orders found in category: " + category);
        }
        return count.length;
    }
}