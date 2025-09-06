import { Request,Response } from "express";
import { OrderManagementService } from "../services/OrderManagement.service";

import {  IdentifiableOrderItem } from "../model/Order.model";
import { JsonRequestFactory } from "../mappers";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class OrderController{
    constructor(private  readonly OrderService: OrderManagementService) {}

    //create an order
    public async createOrder(req:Request,res:Response):Promise<void>{
       
            if (!req.body.category) {
                throw new Error("Order category is required");
            }
            
            console.log("Creating order with category:", req.body.category);
            console.log("Request body:", JSON.stringify(req.body, null, 2));
            
            const order:IdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);
            if (!order) {
                throw new BadRequestException("Order data is required", { orderNotFound: true });
            }
            
            const newOrder = await this.OrderService.createOrder(order);
            res.status(201).json(newOrder);
       
    }

    //get Order
    public async getOrder(req: Request, res: Response): Promise<void> {
        //id is in the param of API
            const Id = req.params.id;

            if (!Id ) {
                throw new Error("Order ID is required");
                return;
            }
            const order = await this.OrderService.getOrder(Id);
            if (!order) {
                throw new BadRequestException("Order not found",{idNotDefined:true });
            }
            res.status(200).json(order);
       
    }
    //get All Orders
    public async getAllOrders(req: Request, res: Response): Promise<void> {
       
            const orders = await this.OrderService.getAllOrders();
            res.status(200).json(orders);
       
    }

    //update Order
    public async updateOrder(req: Request, res: Response): Promise<void> {
     
            const orderId = req.params.id;
            
            if (!req.body.category) {
                throw new BadRequestException("Order category is required", { idNotDefined: true });
            }
            
            const orderData: IdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);
            if (!orderId || !orderData) {
                throw new BadRequestException("Order ID and data are required",{orderNotFound:true});
            }
            if(orderData.getId() !== orderId){ 
                throw new BadRequestException("Order ID  in body is different from id in param",{
                    idNotSame:true,
                    idInParam:orderId,
                    idInBody:orderData.getId()
                });
            }
            const updatedOrder = await this.OrderService.updateOrder(orderData);
            res.status(200).json(updatedOrder);
       
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
    

    //get totale revenue

    //get total orders



    }