import { Request, Response } from "express";
import { AnalyticsService } from "../services/AnalyticsService";
import { ItemCategory } from "../model/IItem";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { ItemNotFoundException } from "../util/exceptions/repositoryException";
import logger from "../util/logger";

export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

  
    public async getTotalOrderCount(req: Request, res: Response): Promise<void> {
        try {
            const count = await this.analyticsService.getTotalOrderCount();
            res.status(200).json({
                totalOrders: count
            });
        } catch (error) {
            throw new BadRequestException("Failed to get total order count", {
                orderNotFound: true
            });
        }
    }

    public async getOrderCountBySpecificType(req: Request, res: Response): Promise<void> {
        try {
            
            const itemType = req.params.type as string;
            
            if (!itemType) {
                throw new BadRequestException("Item type must be specified", {
                    missingField: "type"
                });
            }
            
            
            const validTypes = ['cake', 'book', 'toy'];
            const normalizedType = itemType.toLowerCase();
            
            if (!validTypes.includes(normalizedType)) {
                throw new BadRequestException(`Invalid item type: ${itemType}`, {
                    allowedValues: validTypes
                });
            }
            
            
            let category: ItemCategory;
            switch (normalizedType) {
                case 'cake':
                    category = ItemCategory.CAKE;
                    break;
                case 'book':
                    category = ItemCategory.BOOK;
                    break;
                case 'toy':
                    category = ItemCategory.TOY;
                    break;
                default:
                    throw new BadRequestException(`Unsupported item type: ${itemType}`, {
                        allowedValues: validTypes
                    });
            }
            
    
                logger.info(`Getting order count for category: ${category}`);
                const count = await this.analyticsService.getOrderCountsByCategory(category);
                res.status(200).json({
                    [`${normalizedType}Orders`]: count
                });
            
        } catch (error) {
          
            throw new BadRequestException("Failed to get order count by item type", {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

   
    public async getRevenue(req: Request, res: Response): Promise<void> {
        try {
            const revenue = await this.analyticsService.getTotalRevenue();
            logger.info(`Total revenue across all categories: ${revenue}`);
            res.status(200).json({
                totalRevenue: revenue
            });
        } catch (error) {
            logger.error(`Error in getRevenue controller: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw new BadRequestException("Failed to get total revenue", {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    public async getRevenueBySpecificType(req: Request, res: Response): Promise<void> {
        try {
            const itemType = req.params.type as string;
            
            if (!itemType) {
                throw new BadRequestException("Item type must be specified", {
                    missingField: "type"
                });
            }
            
            const validTypes = ['cake', 'book', 'toy'];
            const normalizedType = itemType.toLowerCase();
            
            if (!validTypes.includes(normalizedType)) {
                throw new BadRequestException(`Invalid item type: ${itemType}`, {
                    allowedValues: validTypes
                });
            }
            
            let category: ItemCategory;
            switch (normalizedType) {
                case 'cake':
                    category = ItemCategory.CAKE;
                    break;
                case 'book':
                    category = ItemCategory.BOOK;
                    break;
                case 'toy':
                    category = ItemCategory.TOY;
                    break;
                default:
                    throw new BadRequestException(`Unsupported item type: ${itemType}`, {
                        allowedValues: validTypes
                    });
            }
            
            logger.info(`Getting revenue for category: ${category}`);
            const revenue = await this.analyticsService.getRevenueByCategory(category);
            res.status(200).json({
                [`${normalizedType}Revenue`]: revenue
            });
        } catch (error) {
           
            throw new BadRequestException("Failed to get revenue by item type", {
                failedType: req.params.type, 
            });
        }
    }
}
