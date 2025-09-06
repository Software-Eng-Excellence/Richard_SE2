import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { OrderManagementService } from '../services/OrderManagement.service';
import { asyncHandler } from '../middleware/asyncHandler';
import {AnalyticsController} from '../controllers/analytics.controller'
import { AnalyticsService } from '../services/AnalyticsService';

const orderController = new OrderController(new OrderManagementService());
const analyticsController = new AnalyticsController(new AnalyticsService());
const route = Router();



// setup paths and methodes
route.route('/')
    .get(asyncHandler(orderController.getAllOrders.bind(orderController)))
    .post(asyncHandler(orderController.createOrder.bind(orderController)));

// Analytics routes - must be defined BEFORE the /:id route
route.route('/revenue')
    .get(asyncHandler(analyticsController.getRevenue.bind(analyticsController)));
route.route('/revenue/:type')
    .get(asyncHandler(analyticsController.getRevenueBySpecificType.bind(analyticsController)));
route.route('/count')
    .get(asyncHandler(analyticsController.getTotalOrderCount.bind(analyticsController)));
route.route('/count/:type')
    .get(asyncHandler(analyticsController.getOrderCountBySpecificType.bind(analyticsController)));

// Order routes with dynamic parameters - must come AFTER more specific routes
route.route("/:id")
    .get(asyncHandler(orderController.getOrder.bind(orderController)))
    .put(asyncHandler(orderController.updateOrder.bind(orderController)))
    .delete(asyncHandler(orderController.deleteOrder.bind(orderController)));
export default route;