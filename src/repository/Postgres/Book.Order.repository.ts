import { id, Initializable, IRepository } from "../IRepository";
import { IdentifiableBook } from "../../model/Book.models";
import { Connection } from "pg";
import { ConnectionManager } from "./ConnectionMananger";
import logger from "../../util/logger";
import { ItemCategory } from "../../model/IItem";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryException";


const tableName = ItemCategory.BOOK;
const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName}(
    id TEXT PRIMARY KEY,
    Booktitle TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    format TEXT NOT NULL,
    language TEXT NOT NULL,
    publisher TEXT NOT NULL,
    specialEdition TEXT NOT NULL,
    packaging TEXT NOT NULL
)`;
const INSERT_BOOK = `INSERT INTO ${tableName} (id, Booktitle, author, genre, format, language, publisher, specialEdition, packaging) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = $1`;
const SELECT_ALL = `SELECT * FROM ${tableName}`;
const DELETE_BY_ID = `DELETE FROM ${tableName} WHERE id = $1`;
const UPDATE_BOOK = `UPDATE ${tableName} SET Booktitle = $1, author = $2, genre = $3, format = $4, language = $5, publisher = $6, specialEdition = $7, packaging = $8 WHERE id = $9`;
export class BookRepository implements IRepository<IdentifiableBook>,Initializable{
    async init(){
        try{
              const conn = await ConnectionManager.getConnection();
        await conn.query(CREATE_TABLE);
        logger.info("Book Table initialized ");

        } catch (error) {
            logger.error("Error initializing book table", error as Error);
            throw new InitializationException("Failed to initialize book table", error as Error);
        }
      
    }
  async  create(item: IdentifiableBook): Promise<id> {
       try{
        const conn = await ConnectionManager.getConnection();
        await conn.query(INSERT_BOOK,[item.getId(),
            item.getBookTitle(),
            item.getAuthor(),
            item.getGenre(),
            item.getFormat(),
            item.getLanguage(),
            item.getPublisher(),
            item.getSpecialEdition(),
            item.getPackaging()
        ]);
         return item.getId();
       }catch(error){
           logger.error("Failed to create book", error as Error);
           throw new DbException("Failed to create book", error as Error);
       }
    }
   async  get(id: id): Promise<IdentifiableBook> {
        try{
            const conn =await ConnectionManager.getConnection();
            const result = await conn.query(SELECT_BY_ID, [id]);
            if (result.rows.length === 0) {
                throw new ItemNotFoundException(`Book with ID ${id} not found`);    
            }
            return result.rows[0];
        }catch(error){
            logger.error("Failed to get book", error as Error);
            throw new DbException("Failed to get book", error as Error);
        }
    }
    async getAll(): Promise<IdentifiableBook[]> {
       try{
        const conn = await ConnectionManager.getConnection();
        const result = await conn.query(SELECT_ALL);
        return result.rows;
       }catch(error){
           logger.error("Failed to get all books", error as Error);
           throw new DbException("Failed to get all books", error as Error);
       }
    }
    async update(item: IdentifiableBook): Promise<void> {
        try{
            const conn = await ConnectionManager.getConnection();
            await conn.query(UPDATE_BOOK, [
                item.getBookTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging(),
                item.getId()
            ]);
        }catch(error){
            logger.error("Failed to update book", error as Error);
            throw new DbException("Failed to update book", error as Error);
        }
    }
    async delete(id: id): Promise<void> {
        try{
            const conn = await ConnectionManager.getConnection();
            await conn.query(DELETE_BY_ID, [id]);
        }catch(error){
            logger.error("Failed to delete book", error as Error);
            throw new DbException("Failed to delete book", error as Error);
        }
    }



}