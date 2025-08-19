import { Book } from "../model/Book.models";
import { IMapper } from "./IMapper";
import { BookBuilder } from "../model/Builder/book.builder";



export class JSONBookMapper implements IMapper<JSON, Book> {
    map(data: JSON): Book {
         const [
            orderId,
           bookTitle,
           author,
           genre,
           format,
           language,
           publisher,
           specialEdition,
           packaging,
           price,
           quantity
         ] = Object.values(data);

        return BookBuilder.newBuilder()
               .setOrderId(orderId )
               .setAuthor(author)
               .setBookTitle(bookTitle)
               .setGenre(genre)
               .setFormat(format)
               .setLanguage(language)
               .setPublisher(publisher)
               .setSpecialEdition(specialEdition)
               .setPackaging(packaging)
               .setPrice(price)
               .setQuantity(quantity)
               .build();
    }
}