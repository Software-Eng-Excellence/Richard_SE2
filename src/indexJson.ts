import { JSONBookMapper } from './mappers/Book.mappers';
import { JSONOrderMapper } from './mappers/OrderJson.mapper';
import { BookBuilder, IdentifiableBookBuilder } from './model/Builder/book.builder';
import { IdentifiableOrderItemBuilder, OrderBuilder } from './model/Builder/order.builder';
import { parseJSON } from './parsers/jsonParser';
import { BookRepository } from './repository/Postgres/Book.Order.repository';
import { OrderRepositoryPostgres } from './repository/Postgres/Order.repository';


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


export async  function DBMode() {
   const dbOrder = new OrderRepositoryPostgres(new BookRepository()); // Use your Postgres CakeRepository if available
    await dbOrder.init();
  
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
DBMode()
  .then(() => {
    console.log("DBMode completed successfully");
  })
  .catch((error) => {
    console.error("DBMode failed:", error);
  });
