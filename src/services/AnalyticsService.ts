import { ItemNotFoundException } from "../util/exceptions/repositoryException";
import config from "../config";
import { ItemCategory } from "../model/IItem";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { IRepository } from "../repository/IRepository";
import { RepositoryFactory } from "../repository/Repository.factory";
import logger from "../util/logger";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class AnalyticsService {

 
    private readonly activeCategories: ItemCategory[] = [ItemCategory.CAKE,ItemCategory.BOOK,ItemCategory.TOY];

    private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        return RepositoryFactory.create(config.dbMode, category);
    }

    public async getTotalRevenue(): Promise<number> {
        let total = 0;
        for (const category of this.activeCategories) {
            try {
                const repo = await this.getRepo(category);
                const orders = await repo.getAll();
        
                for (const order of orders) {
                    total += order.getPrice() * order.getQuantity();
                }
                logger.info(`Total revenue for category ${category}: ${total}`);
            } catch (error) {
               throw new BadRequestException("Failed to get total revenue", {
                   category: category,
                  
               });
            }
        }
    
        return total;
    }

    public async getRevenueByCategory(category: ItemCategory): Promise<number> {
        try {
            const repo = await this.getRepo(category);
          
            const orders = await repo.getAll();
            if(!orders || orders.length === 0) {
                logger.info(`No orders found in category: ${category}, returning 0 revenue`);
                return 0;
            }
            
            const revenues = orders.map(order => order.getPrice() * order.getQuantity());
            let total = 0;
            for (const revenue of revenues) {
                total += revenue;
            }
            logger.info(`Revenue for category ${category}: ${total}`);
            return total;
        } catch (error) {
            
            throw new BadRequestException("Failed to get revenue by category", {
               typeCategory: category
            });
        }
    }


    public async getTotalOrderCount(): Promise<number> {
        let totalCount = 0;
      
        for (const category of this.activeCategories) {
          try {
              const repo = await this.getRepo(category);
              const orders = await repo.getAll();
              totalCount += orders.length;
              logger.info(`Order count for category ${category}: ${orders.length}`);
          } catch (error) {

              throw new BadRequestException(`Failed to get order count for category ${category}`, {
                  category: category
              });
          }
        }
      
        return totalCount;
    }


    public async getOrderCountsByCategory(category: ItemCategory): Promise<number> {
        try {
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
            if(!orders || orders.length === 0) {
                logger.info(`No orders found in category: ${category}, returning 0`);
                return 0;
            }
          
            return orders.length;
        } catch (error) {
            
            throw new BadRequestException("Failed to get order count by category", {
                typeCategory: category
            });
           
        }
    }
}