import { Request, Response } from "express";
import { OrderManagementService } from "../services/OrderManagement.service";

import { IdentifiableOrderItem } from "../model/Order.model";
import { JsonRequestFactory } from "../mappers";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class OrderController {
    constructor(private readonly OrderService: OrderManagementService) { }

    //create an order
    public async createOrder(req: Request, res: Response): Promise<void> {
        try {

            if (!req.body.category) {
                throw new BadRequestException("Order category is required", { missingField: "category" });
            }
        

            const category = req.body.category.toLowerCase();
            // if (!['cake', 'book', 'toy'].includes(category)) {
            //     throw new BadRequestException("Invalid category. Must be one of: cake, book, toy", {
            //         invalidCategory: true,
            //         allowedCategories: ['cake', 'book', 'toy']
            //     });

            const order: IdentifiableOrderItem = JsonRequestFactory.create(category).map(req.body);

                const newOrder = await this.OrderService.createOrder(order);
                res.status(201).json(newOrder);
        
            
        } catch (error) {

            throw new BadRequestException("Internal error creating order", {
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

 
    public async getOrder(req: Request, res: Response): Promise<void> {
        
        const Id = req.params.id;

        if (!Id) {
            throw new Error("Order ID is required");

        }
        const order = await this.OrderService.getOrder(Id);
        if (!order) {
            throw new BadRequestException("Order not found", { idNotDefined: true });
        }
        res.status(200).json(order);

    }
  
    public async getAllOrders(req: Request, res: Response): Promise<void> {

        const orders = await this.OrderService.getAllOrders();
        res.status(200).json(orders);

    }

    //update Order
    public async updateOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;

            // Log the request body for debugging
            console.log("Update request body:", JSON.stringify(req.body, null, 2));

            if (!req.body.category) {
                throw new BadRequestException("Order category is required", { idNotDefined: true });
            }

        
                const orderData: IdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);

                if (!orderId || !orderData) {
                    throw new BadRequestException("Order ID and data are required", { orderNotFound: true });
                }

                // Ensure IDs match
                if (orderData.getId() !== orderId) {
                    throw new BadRequestException("Order ID in body is different from id in param", {
                        idNotSame: true,
                        idInParam: orderId,
                        idInBody: orderData.getId()
                    });
                }

              
               

                const updatedOrder = await this.OrderService.updateOrder(orderData);
                res.status(200).json(updatedOrder);
           
        } catch (error) {
            console.error("Controller error in updateOrder:", error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException("Internal error updating order", {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    //delete order
    public async deleteOrder(req: Request, res: Response): Promise<void> {
        const orderId = req.params.id;
        const category = req.body.category;

        if (!orderId || !category) {
            throw new BadRequestException("Order ID and category are required", { idNotDefined: true });
        }

        await this.OrderService.deleteOrder(orderId, category);
        res.status(204).send();
    }


   



}