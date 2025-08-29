import { IIdentifiableOrderItem, IOrder } from "../../model/IOrder";
import { id, Initializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { DbException, InitializationException } from "../../util/exceptions/repositoryException";
import { ConnectionManager } from "./ConnectionManager";
import { IIdentifiableItem } from "../../model/IItem";
import { log } from "console";
import { SQLiteOrder, SQLiteOrderMapper } from "../../mappers/Order.mapper";


const CREATE_TABLE = `
      CREATE TABLE IF NOT EXISTS "order" (
        id TEXT PRIMARY KEY AUTOINCREMENT,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        item_category TEXT NOT NULL,
        item_id TEXT NOT NULL
        )`;

const INSERT_ORDER = `INSERT INTO "order" (id, quantity, price, item_category, item_id) VALUES (?, ?, ?, ?, ?)`;
const SELECT_BY_ID=`SELECT * FROM "order" WHERE id = ?`;
const SELECT_ALL=`SELECT * FROM "order"`;
const DELETE_BY_ID = `DELETE FROM "order" WHERE id = ?`;
const UPDATE_ORDER = `UPDATE "order" SET quantity = ?, price = ?, item_category = ?, item_id = ? WHERE id = ?`;
export class OrderRepository implements IRepository<IIdentifiableOrderItem>, Initializable {

    constructor(private readonly itemRepository:IRepository<IIdentifiableItem> & Initializable) {

    }
   
   
    async init() {
        try {
        const conn = await ConnectionManager.getConnection();
        await conn.exec(CREATE_TABLE);
        await this.itemRepository.init();
        } catch (error: unknown) {
            logger.error("Error initializing order table", error as Error);
            throw new InitializationException("Failed to initilize order table", error as Error);
        }

    }

    async create(order: IIdentifiableOrderItem): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
           
            await conn.exec("BEGIN TRANSACTION");
            
            // Check if order already exists FIRST
            const existingOrder = await conn.get(
                `SELECT id FROM "order" WHERE id = ?`, 
                [order.getId()]
            );
            
            if (existingOrder) {
                logger.info(`Order with ID ${order.getId()} already exists, skipping creation`);
                await conn.exec("COMMIT");
                return order.getId(); // Return existing ID
            }
            
            const item_id = await this.itemRepository.create(order.getItem()); 
            await conn.run(INSERT_ORDER,
                 [order.getId(), 
                     order.getQuantity(), 
                     order.getPrice(), 
                     order.getItem().getCategory(),
                      item_id
                ]);
            await conn.exec("COMMIT");
            return order.getId();
        }
        catch (error: unknown) {
            logger.error("Error creating order", error as Error);
            conn && await conn.exec("ROLLBACK");
            throw new DbException("Failed to create order", error as Error);
        }
    }
     async  get(id: id): Promise<IIdentifiableOrderItem> {
        try{
              const  conn = await ConnectionManager.getConnection();
              const result  = await conn.get<SQLiteOrder>(SELECT_BY_ID,[id]);
              if(!result){
                logger.error(`Order with ID ${id} not found`,id);
                  throw new DbException("Order not found", new Error("No record found for the given ID"));
              }
             const cake= await this.itemRepository.get(result.item_id);
              logger.info("Order got: %o", result);
              return new SQLiteOrderMapper().map({data: result, item: cake});
        }catch(error){
            logger.error("Failed to get order of id %o %o", id,error as Error)
            throw new DbException("Failed to get order of id"+id, error as Error);   
        }
    
       
    }
   
   async getAll(): Promise<IIdentifiableOrderItem[]> {
        try{
            const conn = await ConnectionManager.getConnection();
            const items = await this.itemRepository.getAll();
          //logger.info("Items got: %o", items);
            // if(items.length===0){
            //     return [];
            // }
            const orders = await conn.all<SQLiteOrder[]>(SELECT_ALL); // No parameters needed for SELECT_ALL
           const bindOrders = orders.map((order) => {
               const item = items.find((item) => item.getId() === order.item_id);
               if(!item){
                 
                   throw new Error("Item of id "+order.item_id+" not found for order id ");
               }
               return { order, item};
           });


           const mapper = new SQLiteOrderMapper();
           const IdentifiableOrders=bindOrders.map(({order,item})=> {
            return mapper.map({data :order,item});
           });
          return IdentifiableOrders;
        }catch(error){
            logger.error("Failed to get all orders %o",error as Error)
            throw new DbException("Failed to get all orders", error as Error);
        }

    }
    async update(item: IIdentifiableOrderItem): Promise<void> {
        let conn;
        try{
            conn = await ConnectionManager.getConnection();
            await conn.exec("BEGIN TRANSACTION");
            await this.itemRepository.update(item.getItem());
            await conn.run(UPDATE_ORDER, [
                item.getQuantity(),
                item.getPrice(),
                item.getItem().getCategory(),
                item.getItem().getId(),
                item.getId()
            ]);
            conn.exec("COMMIT");
        }catch(error){
             logger.error("Failed to update order of id %s %o",item.getId(),error as Error);
            conn && await conn.exec("ROLLBACK");
            throw new DbException("Failed to update order of id" + item.getId(), error as Error);
        }
    }
async delete(id: id): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
           
            await conn.exec("BEGIN TRANSACTION");
            
            const item_id = await this.itemRepository.delete(id); 
            await conn.run(DELETE_BY_ID,[id])
            await conn.exec("COMMIT");
            
        }
        catch (error: unknown) {
            logger.error("Error delete ", error as Error);
            conn && await conn.exec("ROLLBACK");
            throw new DbException("Failed to create order", error as Error);
        }
    
    }
}