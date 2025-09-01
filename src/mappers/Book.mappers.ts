import { Book, IdentifiableBook } from "../model/Book.models";
import { IMapper } from "./IMapper";
import { BookBuilder, IdentifiableBookBuilder } from "../model/Builder/book.builder";



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


export interface PostgresBook {
     id: string;
     booktitle: string;
     author: string;
     genre: string;
     format: string;
     language: string;
     publisher: string;
     specialEdition: string;
     packaging: string;
  
}

export class PostgresBookMapper implements IMapper<PostgresBook, IdentifiableBook> {
    map(data: PostgresBook | any): IdentifiableBook {
      
        return IdentifiableBookBuilder.newBuilder()
            .setBook(BookBuilder.newBuilder()
                .setAuthor(data.author)
                .setBookTitle(data.booktitle)
                .setFormat(data.format)
                .setGenre(data.genre)
                .setLanguage(data.language)
                .setPackaging(data.packaging)
                .setPublisher(data.publisher)
                .setSpecialEdition(data.specialEdition)
                .build())
            .setId(data.id)     
            .build();
    }

    reverse(data: IdentifiableBook): PostgresBook {
        return {
         id: data.getId(),
         booktitle: data.getBookTitle(),
         author: data.getAuthor(),
         genre: data.getGenre(),
         format: data.getFormat(),
         language: data.getLanguage(),
         publisher: data.getPublisher(),
         packaging: data.getPackaging(),
         specialEdition: data.getSpecialEdition()

        };
    }
}