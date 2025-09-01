import { id } from '../../repository/IRepository';
import {Book, IdentifiableBook} from '../Book.models'

export class BookBuilder{
    setPublicationDate(arg0: Date) {
      throw new Error('Method not implemented.');
    }
   
    
    private bookTitle!: string;
    private author!: string;
    private genre!: string;
    private format!: string;
    private language!: string;
    private publisher!: string;
    private specialEdition!: string;
    private packaging!: string;
   

    public static newBuilder(): BookBuilder {
        return new BookBuilder();
    }


    setBookTitle(bookTitle: string): BookBuilder {
        this.bookTitle = bookTitle;
        return this;
    }

    setAuthor(author: string): BookBuilder {
        this.author = author;
        return this;
    }

    setGenre(genre: string): BookBuilder {
        this.genre = genre;
        return this;
    }

    setFormat(format: string): BookBuilder {
        this.format = format;
        return this;
    }

    setLanguage(language: string): BookBuilder {
        this.language = language;
        return this;
    }

    setPublisher(publisher: string): BookBuilder {
        this.publisher = publisher;
        return this;
    }

    setSpecialEdition(specialEdition: string): BookBuilder {
        this.specialEdition = specialEdition;
        return this;
    }

    setPackaging(packaging: string): BookBuilder {
        this.packaging = packaging;
        return this;
    }

   

    build(): Book {
       const required=[
          
           this.bookTitle,
           this.author,
           this.genre,
           this.format,
           this.language,
           this.publisher,
           this.specialEdition,
           this.packaging,
           
       ]
          for (const prop of required) {
            if (prop === undefined || prop === null) {
                throw new Error("Missing required book property");
            }
        }
       return new Book(
          
           this.bookTitle,
           this.author,
           this.genre,
           this.format,
           this.language,
           this.publisher,
           this.specialEdition,
           this.packaging,
          
       );

    }
}
export class IdentifiableBookBuilder extends BookBuilder{
    private id!: id;
    private book!: Book;


    
    static newBuilder(): IdentifiableBookBuilder {
        return new IdentifiableBookBuilder();
    }

    setId(id:id): IdentifiableBookBuilder {
        this.id = id;
        return this;
    }
    setBook(book: Book): IdentifiableBookBuilder {
        this.book = book;
        return this;
    }
    build(): IdentifiableBook {
        if(!this.book || !this.id){
            throw new Error("Missing required book properties");
        }
        return new IdentifiableBook(
            this.id,
            this.book.getBookTitle(),
            this.book.getAuthor(),
            this.book.getGenre(),
            this.book.getFormat(),
            this.book.getLanguage(),
            this.book.getPublisher(),
            this.book.getSpecialEdition(),
            this.book.getPackaging(),
           
        );
    }   
}
