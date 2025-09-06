  import { DBMode } from './config/type';
import { BookBuilder, IdentifiableBookBuilder } from './model/Builder/book.builder';
import { IdentifiableOrderItemBuilder, OrderBuilder } from './model/Builder/order.builder';
import { ItemCategory } from './model/IItem';
import {  RepositoryFactory } from './repository/Repository.factory';


// export async function main1() {
//   try{
//   const data = await parseJSON('src/data/book_orders.json');

//   const bookMapper  = new JSONBookMapper();
//   const orderMapper = new JSONOrderMapper(bookMapper);
//   const orders = Array.isArray(data) ? data.map(orderMapper.map.bind(orderMapper)) : [];

//   logger.info("List of orders: %o", orders);
//   } catch(error){
//     logger.error("Failed to load or map orders: %o", error);
//   }
// }



    // main1();
export async  function JsonPostgres() {
    const dbOrder =await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.BOOK);

    // Create your cake and order objects as before
    const bookId = `book-${Math.random().toString(36).substr(2, 9)}`;
    const orderId = `order-${Math.random().toString(36).substr(2, 9)}`;
          const book = BookBuilder.newBuilder()
              .setBookTitle("The Great Gatsby")
              .setAuthor("F. Scott Fitzgerald")
              .setGenre("Fiction")
              .setFormat("Hardcover")
              .setLanguage("English")
              .setPublisher("Scribner")
              .setSpecialEdition("9780743273565")
              .setPackaging("Boxed Set")
              .build();

    const idBook = IdentifiableBookBuilder.newBuilder().setBook(book).setId(bookId).build();

    const order = OrderBuilder.newBuilder()
      .setItems(idBook)
      .setPrice(25.0)
      .setQuantity(1)
      .setId(orderId)
      .build();
    const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItems(idBook).setOrder(order).build();
  
    // Add the order to Postgres
     await dbOrder.create(idOrder);
    console.log(await dbOrder.get(idOrder.getId()));
  

}
JsonPostgres()
  .then(() => {
    console.log("DBMode completed successfully");
  })
  .catch((error) => {
    console.error("DBMode failed:", error);
  });
