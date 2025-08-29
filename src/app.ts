// //Solid Principals

// import logger from "./util/logger";

// //Single Responsability Principale (SRP)
// //its means that each class has a 1 functionality 

// //open closed Principale (OCP)
// //its means that the class is open for extension but closed for modification

// // liskov Substitution Principale (LSP)
// //interface segregation principale (ISP) (all methode is related and same in orhter class not there are different utilisation)

// //Dependancy Inversion Principle (DIP)
// // High-level modules should not depend on low-level modules. Both should depend on abstractions.

// export interface Order {
//     id: number;
//     item: string;
//     price: number;
// }

// export class OrderManagement {
//     //get orders,store orders, and add orders
//     private orders: Order[] = [];
//     constructor(private validator: IValidator, private calculator: ICalculator) {
//         logger.debug("OrderManagement instance created");
//     }
//     getOrders() {
//         return this.orders;

//     }
//     addOrder(item: string, price: number) {
//         try {
//             const order: Order = { id: this.orders.length + 1, item, price };
//             this.validator.validate(order);  // Use injected validator, NOT new Validator()
//             this.orders.push(order);
//         } catch (error: any) {
//             throw new Error("[OrderManagement]  Error adding orders: " + error.message);
//         }



//     }
//     getOrder(id: number) {
//         return this.getOrders().find(order => order.id === id);
//     }
//     getTotalRevenue() {
//         return this.calculator.getRevenue(this.orders);
//     }
//     getBuyPower() {
//         return this.calculator.getAverageBuyPower(this.orders);
//     }

// }
// export class PremiumOrderManagement extends OrderManagement {
//     //additional functionality for premium orders
//     getOrder(id: number): Order | undefined {
//         console.log("ALERT: Premium order accessed");
//         return super.getOrder(id);
//     }

// }

// class MaxPriceValidator implements IValidator {
//     validate(order: Order): void {
//         if (order.price > 100) {
//             throw new Error("Price must be less than or equal to 100");
//         }
//     }
// }
// class PriceValidator implements IValidator {
//     validate(order: Order): void {
//         if (order.price <= 0) {
//             throw new Error("Price must be greater than zero");
//         }
//     }
// }
// class ItemValidator implements IValidator, IPossibleItems {
//     getPossibleItems(): string[] {
//         return ItemValidator.possibleItems;
//     }
//     private static possibleItems = [
//         "Sponge",
//         "Chocolate",
//         "Fruit",
//         "Red Velvet",
//         "Birthday",
//         "Carrot",
//         "Marble",
//         "Coffee",
//     ];
//     validate(order: Order) {
//         if (!ItemValidator.possibleItems.includes(order.item)) {
//             throw new Error(`Invalid item. Must be one of: ${ItemValidator.possibleItems.join(", ")}`);
//         }
//     }
// }

// interface IValidator {
//     validate(order: Order): void;

// }
// interface IPossibleItems {
//     getPossibleItems(): string[];
// }
// export class Validator implements IValidator {
//     private static rules: IValidator[] = [
//         new PriceValidator(),
//         new MaxPriceValidator(),
//         new ItemValidator(),
//     ];

//     validate(order: Order): void {
//         for (const rule of Validator.rules) {
//             rule.validate(order);
//         }
//     }

//     // validate item is possible
// }
// //validate price positive

// interface ICalculator {
//     getRevenue(orders: Order[]): number;
//     getAverageBuyPower(orders: Order[]): number;
// }


// export class FinanceCalculator implements ICalculator {

//     // Returns the total revenue from all orders
//     public getRevenue(orders: Order[]) {
//         return orders.reduce((total, order) => total + order.price, 0);
//     }

//     // Returns the average buy power (average price per order)
//     public getAverageBuyPower(orders: Order[]) {
//         return orders.length === 0 ? 0 : this.getRevenue(orders) / orders.length;
//     }


// }