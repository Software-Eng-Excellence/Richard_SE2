import { IdentifiableCake } from "../../model/Cake.model";
import { id, Initializable, IRepository } from "../IRepository";
import { Database } from "sqlite3";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryException";
import logger from "../../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { ItemCategory } from "../../model/IItem";
import { SQLiteCake, SqliteCakeMapper } from "../file/Cake.order.repository";




const tableName = ItemCategory.CAKE;
logger.info(`Using table: ${tableName}`);
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${tableName}(
    id TEXT PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    flavor TEXT NOT NULL,
    filling TEXT NOT NULL,
    size INTEGER NOT NULL,
    layers INTEGER NOT NULL,
    frostingType TEXT NOT NULL,
    frostingFlavor TEXT NOT NULL,
    decorationType TEXT NOT NULL,
    decorationColor TEXT NOT NULL,
    customMessage TEXT NOT NULL,
    shape TEXT NOT NULL,
    allergies TEXT NOT NULL,
    specialIngredients TEXT NOT NULL,
    packagingType TEXT NOT NULL


)`;

const INSERT_CAKE = `INSERT INTO ${tableName} (
id, type, flavor, filling, size, layers, 
frostingType, frostingFlavor, decorationType,
 decorationColor, customMessage, shape, allergies,
  specialIngredients, packagingType) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = ?`;
const SELECT_ALL = `SELECT * FROM ${tableName}`;
const DELETE_BY_ID = `DELETE FROM ${tableName} WHERE id = ?`;
const UPDATE_CAKE = `UPDATE ${tableName} SET type = ?, flavor = ?, filling = ?, size = ?, layers = ?, frostingType = ?, frostingFlavor = ?, decorationType = ?, decorationColor = ?, customMessage = ?, shape = ?, allergies = ?, specialIngredients = ?, packagingType = ? 
WHERE id = ?`;

export class CakeRepository implements IRepository<IdentifiableCake>, Initializable {
   
    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("Order table initialized");
        } catch (error: unknown) {
            logger.error("Error initializing cake table", error as Error);
            throw new InitializationException("Failed to initilize cake table", error as Error);

        }
    }
    async create(item: IdentifiableCake): Promise<id> {
        //it is expected that a transation has been initiated before this methode is called
        try { 
            const conn = await ConnectionManager.getConnection();
            
            // Check if cake already exists FIRST
            const existingCake = await conn.get(
                `SELECT id FROM ${tableName} WHERE id = ?`, 
                [item.getId()]
            );
            
            if (existingCake) {
                logger.info(`Cake with ID ${item.getId()} already exists, skipping creation`);
                return item.getId(); // Return existing ID
            }
            
            // Insert only if doesn't exist
            await conn.run(INSERT_CAKE, [
                item.getId(),
                item.getType(),
                item.getFlavor(),   
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType()
            ]);
            
            return item.getId();
         
        } catch (error: unknown) {
            logger.error("Error creating cake", error as Error);
            throw new DbException("Failed to create cake", error as Error);
        }
    }
    async get(id: id): Promise<IdentifiableCake> { 
         try{
              const  conn = await ConnectionManager.getConnection();
              const result = await conn.get<SQLiteCake>(SELECT_BY_ID,[id]);
              logger.info("Cake got: %o", result);  
              if(!result){
                throw new ItemNotFoundException(`Cake with ID ${id} not found`);
              }
              return new SqliteCakeMapper().map(result);
        }catch(error){
            logger.error("Failed to get cake of id %o %o", id,error as Error)
            throw new DbException("Failed to get cake id"+id, error as Error);   
        }
    }
async  getAll(): Promise<IdentifiableCake[]> {
          try{
              const  conn = await ConnectionManager.getConnection();
              const result = await conn.all<SQLiteCake[]>(SELECT_ALL);
            //logger.info("data result %o", result);
              const mapper = new SqliteCakeMapper();
              return result.map((cake) => mapper.map(cake));
            //logger.info("Cakes got: %o", result);
        }catch(error){
            logger.error("Failed to get all cakes")
            throw new DbException("Failed to get all cakes", error as Error);
        }
    }
    
    async update(item: IdentifiableCake): Promise<void> {
        try{
            const conn = await ConnectionManager.getConnection();
            await conn.run(UPDATE_CAKE, [
                item.getId(),
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType()
            ]);
        }catch(error){
            logger.error("Failed to update cake of id %o %o", item.getId(), error as Error);
            throw new DbException("Failed to update cake of id" + item.getId(), error as Error);
        }
    }



async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(DELETE_BY_ID, [id]);
            
        } catch (error: unknown) {
            logger.error("Failed to delete cake of id %o %o", id, error as Error);
            throw new DbException("Failed to delete cake of id" + id, error as Error);
        }
    }



}
