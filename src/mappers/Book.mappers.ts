import { Book } from "../model/Book.models";
import { IMapper } from "./IMapper";
import { BookBuilder } from "../model/Builder/book.builder";



export class JSONBookMapper implements IMapper<object, Book> {
    map(data: object): Book {
         const [
         
           bookTitle,
           author,
           genre,
           format,
           language,
           publisher,
           specialEdition,
           packaging,
         ] = Object.values(data);

        return BookBuilder.newBuilder()
               
               .setAuthor(author)
               .setBookTitle(bookTitle)
               .setGenre(genre)
               .setFormat(format)
               .setLanguage(language)
               .setPublisher(publisher)
               .setSpecialEdition(specialEdition)
               .setPackaging(packaging)
               
               .build();
    }
   reverse(data: Book): object {
      return {
         
         bookTitle: data.getBookTitle(),
         author: data.getAuthor(),
         genre: data.getGenre(),
         format: data.getFormat(),
         language: data.getLanguage(),
         publisher: data.getPublisher(),
         specialEdition: data.getSpecialEdition(),
         packaging: data.getPackaging()
      };
   }
}