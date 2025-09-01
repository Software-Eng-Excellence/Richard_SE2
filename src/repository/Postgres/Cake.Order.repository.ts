import { IdentifiableCake } from "../../model/Cake.model";
import { id, Initializable, IRepository } from "../IRepository";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryException";
import logger from "../../util/logger";
import  {ConnectionManager}  from "./ConnectionMananger";
import { ItemCategory } from "../../model/IItem";
import { PostgresCake } from "../../mappers/Cake.mappers";
import { MapperFactory, MapperType } from "../../mappers/Mapper.factory";

const tableName = ItemCategory.CAKE;
logger.info(`Using table: ${tableName}`);

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName}(
    id TEXT PRIMARY KEY,
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
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`;

const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = $1`;
const SELECT_ALL = `SELECT * FROM ${tableName}`;
const DELETE_BY_ID = `DELETE FROM ${tableName} WHERE id = $1`;
const UPDATE_CAKE = `UPDATE ${tableName} SET type = $1, flavor = $2, filling = $3, size = $4, layers = $5, 
frostingType = $6, frostingFlavor = $7, decorationType = $8, decorationColor = $9, customMessage = $10, 
shape = $11, allergies = $12, specialIngredients = $13, packagingType = $14 
WHERE id = $15`;

export class CakeRepository implements IRepository<IdentifiableCake>, Initializable {
   
    async init(): Promise<void> {
        try {
            const client = await ConnectionManager.getConnection();
            await client.query(CREATE_TABLE);
            logger.info("Cake table initialized");
        } catch (error: unknown) {
            logger.error("Error initializing cake table", error as Error);
            throw new InitializationException("Failed to initilize cake table", error as Error);
        }
    }
    
    async create(item: IdentifiableCake): Promise<id> {
        try { 
            const client = await ConnectionManager.getConnection();
            
            // Check if cake already exists FIRST
            const existingResult = await client.query(
                `SELECT id FROM ${tableName} WHERE id = $1`, 
                [item.getId()]
            );
            
            if (existingResult.rows.length > 0) {
                logger.info(`Cake with ID ${item.getId()} already exists, skipping creation`);
                return item.getId(); // Return existing ID
            }
          //  console.log("Adding cake item %o", item);
            // Insert only if doesn't exist
            await client.query(INSERT_CAKE, [
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
              const client = await ConnectionManager.getConnection();
              const result = await client.query(SELECT_BY_ID, [id]);
              logger.info("Cake got: %o", result.rows[0]);  
              
              if(result.rows.length === 0){
                throw new ItemNotFoundException(`Cake with ID ${id} not found`);
              }
             
              const mapper = MapperFactory.createMapper<PostgresCake, IdentifiableCake>(MapperType.POSTGRES, ItemCategory.CAKE);
              return mapper.map(result.rows[0]);
        } catch(error){
            logger.error("Failed to get cake of id %o %o", id, error as Error)
            throw new DbException("Failed to get cake id"+id, error as Error);   
        }
    }
    
    async getAll(): Promise<IdentifiableCake[]> {
          try{
              const client = await ConnectionManager.getConnection();
              const result = await client.query(SELECT_ALL);
              const mapper = MapperFactory.createMapper<PostgresCake, IdentifiableCake>(MapperType.POSTGRES, ItemCategory.CAKE);
              return result.rows.map((cake: PostgresCake) => mapper.map(cake));
        } catch(error){
            logger.error("Failed to get all cakes")
            throw new DbException("Failed to get all cakes", error as Error);
        }
    }
    
    async update(item: IdentifiableCake): Promise<void> {
        try{
            const client = await ConnectionManager.getConnection();
            await client.query(UPDATE_CAKE, [
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
                item.getPackagingType(),
                item.getId() // Last parameter for WHERE clause
            ]);
        } catch(error){
            logger.error("Failed to update cake of id %o %o", item.getId(), error as Error);
            throw new DbException("Failed to update cake of id" + item.getId(), error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        try {
            const client = await ConnectionManager.getConnection();
            await client.query(DELETE_BY_ID, [id]);
        } catch (error: unknown) {
            logger.error("Failed to delete cake of id %o %o", id, error as Error);
            throw new DbException("Failed to delete cake of id" + id, error as Error);
        }
    }
}
