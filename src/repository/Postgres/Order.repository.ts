import { IIdentifiableOrderItem, IOrder } from "../../model/IOrder";
import { id, Initializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { DbException, InitializationException } from "../../util/exceptions/repositoryException";
import { ConnectionManager } from "./ConnectionMananger";
import { IIdentifiableItem } from "../../model/IItem";
import { PostgresOrder, PostgresOrderMapper } from "../../mappers/Order.mapper";
import { IdentifiableCake } from "../../model/Cake.model";

const CREATE_TABLE = `
    CREATE TABLE IF NOT EXISTS "order" (
      id TEXT PRIMARY KEY,
      quantity INTEGER NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      item_category TEXT NOT NULL,
      item_id TEXT NOT NULL
    )`;

const INSERT_ORDER = `INSERT INTO "order" (id, quantity, price, item_category, item_id) VALUES ($1, $2, $3, $4, $5)`;
const SELECT_BY_ID = `SELECT * FROM "order" WHERE id = $1`;
const SELECT_ALL = `SELECT * FROM "order"`;
const DELETE_BY_ID = `DELETE FROM "order" WHERE id = $1`;
const UPDATE_ORDER = `UPDATE "order" SET quantity = $1, price = $2, item_category = $3, item_id = $4 WHERE id = $5`;

export class OrderRepositoryPostgres implements IRepository<IIdentifiableOrderItem>, Initializable {
    constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & Initializable) { }
    async get(id: id): Promise<IIdentifiableOrderItem> {
        const client = await ConnectionManager.getConnection();
        try {
            const result = await client.query<PostgresOrder>(SELECT_BY_ID, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Order with ID ${id} not found`);
            }
            const orderData = result.rows[0];
            const items = await this.itemRepository.get(orderData.item_id);
            const postgresOrder: PostgresOrder = {
                id: orderData.id,
                quantity: orderData.quantity,
                price: orderData.price,
                item_category: orderData.item_category,
                item_id: orderData.item_id
            };
          

            return new PostgresOrderMapper().map({ data: postgresOrder, item: items });

        } catch (error: unknown) {
            logger.error(`Error fetching order with ID ${id}`, error as Error);
            throw new DbException(`Failed to get order with ID ${id}`, error as Error);
        }
    }
    async getAll(): Promise<IIdentifiableOrderItem[]> {

        try {
            const client = await ConnectionManager.getConnection();
            const result = await client.query(SELECT_ALL);
            const mapper = new PostgresOrderMapper();
            const orders = await Promise.all(result.rows.map(async (orderData) => {
                const item = await this.itemRepository.get(orderData.item_id);
                const postgresOrder: PostgresOrder = {
                    id: orderData.id,
                    quantity: orderData.quantity,
                    price: orderData.price,
                    item_category: orderData.item_category,
                    item_id: orderData.item_id
                };
                return mapper.map({ data: postgresOrder, item });
            }));
            return orders;

        } catch (error: unknown) {
            logger.error("Failed to get all orders", error as Error);
            throw new DbException("Failed to get all orders", error as Error);
        }
    }

    async update(item: IIdentifiableOrderItem): Promise<void> {
        const client = await ConnectionManager.getConnection();
        try {
            await client.query('BEGIN');
            await this.itemRepository.update(item.getItem());
            await client.query(UPDATE_ORDER, [
                item.getQuantity(),
                item.getPrice(),
                item.getItem().getCategory(),
                item.getItem().getId(),
                item.getId()
            ]);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error("Failed to update order of id %s", item.getId(), error as Error);
            throw new DbException("Failed to update order of id " + item.getId(), error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        const client = await ConnectionManager.getConnection();
        try {
            await client.query('BEGIN');
            await this.itemRepository.delete(id); // If you want to delete the item as well
            await client.query(DELETE_BY_ID, [id]);
            await client.query('COMMIT');
            console.log("Deleted");
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error("Error deleting order", error as Error);
            throw new DbException("Failed to delete order", error as Error);
        }
    }

    async init() {
        try {
            const client = await ConnectionManager.getConnection();
            await client.query(CREATE_TABLE);
            await this.itemRepository.init();
        } catch (error: unknown) {
            logger.error("Error initializing order table", error as Error);
            throw new InitializationException("Failed to initialize order table", error as Error);
        }
    }

    async create(order: IIdentifiableOrderItem): Promise<id> {
        const client = await ConnectionManager.getConnection();
        try {
            await client.query('BEGIN');

            // Check if order already exists
            const existingOrder = await client.query(
                `SELECT id FROM "order" WHERE id = $1`,
                [order.getId()]
            );

            if (existingOrder.rows.length > 0) {
                logger.info(`Order with ID ${order.getId()} already exists, skipping creation`);
                await client.query('COMMIT');
                return order.getId();
            }

            const item_id = await this.itemRepository.create(order.getItem());
            await client.query(INSERT_ORDER, [
                order.getId(),
                order.getQuantity(),
                order.getPrice(),
                order.getItem().getCategory(),
                item_id
            ]);
            await client.query('COMMIT');
            // console.log("Order created with ID %o", order);
            return order.getId();
        } catch (error: unknown) {
            await client.query('ROLLBACK');
            logger.error("Error creating order", error as Error);
            throw new DbException("Failed to create order", error as Error);
        }
    }

}
