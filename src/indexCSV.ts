// import config from "./config/index";
// import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
// import logger from "./util/logger";
// import { OrderRepository } from "./repository/sqlite/Order.repository";
// import {CakeRepository} from "./repository/sqlite/Cake.order.repository";
// import { CakeBuilder, IdentifiableCakeBuilder } from "./model/Builder/cake.builder";
// import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/Builder/order.builder";
// import { DBMode, RepositoryFactory } from "./repository/Repository.factory";
// import { ItemCategory } from "./model/IItem";


// export async function main() {
//     try {

//         const path = config.Storage.csv.cake;
//         const repository = new CakeOrderRepository(path);
//         const data = await repository.get( "17");

//         logger.info("List of orders: \n %o", data);

//     } catch (error) {
//         logger.error("Failed to load or map orders: %o", error);

//     }
   
// }
    
// async function DBSandBox(){
//      const dbOrder = await RepositoryFactory.create(DBMode.SQLITE , ItemCategory.CAKE);
//       // Use random IDs to create multiple different orders
//       const cakeId = `cake-${Math.random().toString(36).substr(2, 9)}`;
//       const orderId = `order-${Math.random().toString(36).substr(2, 9)}`;
      
//       //create identifiable cake
//       const cake= CakeBuilder.newBuilder()
//       .setType("Birthday")
//       .setFlavor("Chocolate")
//       .setFilling("Vanilla")
//       .setSize(10)
//       .setLayers(2)
//       .setFrostingType("Buttercream")
//       .setFrostingFlavor("Chocolate")
//       .setDecorationType("Sprinkles")
//       .setDecorationColor("Rainbow")
//       .setCustomMessage("Happy Birthday!")
//       .setShape("Round")
//       .setAllergies("Nuts")
//       .setSpecialIngredients("None")
//       .setPackagingType("Box")
//       .build();
//       const idCake= IdentifiableCakeBuilder.newBuilder().setCake(cake).setId(cakeId).build();

//       //create identifiable order
//       const order = OrderBuilder.newBuilder()
//       .setItems(idCake)
//       .setPrice(25.0)
//       .setQuantity(1)
//       .setId(orderId)
//       .build();
//       const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItems(idCake).setOrder(order).build();
//       await dbOrder.create(idOrder);
      
//       // Get all orders and display them
//       const allOrders = await dbOrder.getAll();
//       console.log("All orders count:", allOrders.length);
//    console.log("All orders:", allOrders.map(order => ({
//               id: order.getId(),
//               quantity: order.getQuantity(),
//               price: order.getPrice(),
//               itemId: order.getItem(),
//               itemCategory: order.getItem().getCategory(),
 
// })));

// }  

//         DBSandBox().catch(error => logger.error("Failed to create order: %o", error));
import { OrderRepositoryPostgres } from "./repository/Postgres/Order.repository";
import {CakeRepository} from "./repository/Postgres/Cake.Order.repository";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/Builder/cake.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/Builder/order.builder";
// ...other imports...

async function addOrderToPostgres() {
  const dbOrder = new OrderRepositoryPostgres(new CakeRepository()); // Use your Postgres CakeRepository if available
  await dbOrder.init();

  // Create your cake and order objects as before
  const cakeId = `cake-${Math.random().toString(36).substr(2, 9)}`;
  const orderId = `order-${Math.random().toString(36).substr(2, 9)}`;
        const cake = CakeBuilder.newBuilder()
            .setType("Birthday")
            .setFlavor("Chocolate")
            .setFilling("Vanilla")
            .setSize(10)
            .setLayers(2)
            .setFrostingType("Buttercream")
            .setFrostingFlavor("Chocolate")
            .setDecorationType("Sprinkles")
            .setDecorationColor("Rainbow")
            .setCustomMessage("Happy Birthday!")
            .setShape("Round")
            .setAllergies("Nuts")
            .setSpecialIngredients("None")
            .setPackagingType("Box")
            .build();

  const idCake = IdentifiableCakeBuilder.newBuilder().setCake(cake).setId(cakeId).build();

  const order = OrderBuilder.newBuilder()
    .setItems(idCake)
    .setPrice(25.0)
    .setQuantity(1)
    .setId(orderId)
    .build();
  const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItems(idCake).setOrder(order).build();

  // Add the order to Postgres
   await dbOrder.create(idOrder);
  console.log(await dbOrder.get(idOrder.getId()));

}
        // Call the function
addOrderToPostgres().catch(error => console.error("Failed to add order:", error));