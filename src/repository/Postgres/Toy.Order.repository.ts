import { id, Initializable, IRepository } from "../IRepository";
import { IdentifiableToy } from "../../model/Toy.models";
import { ConnectionManager } from "./ConnectionMananger";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryException";
import { ItemCategory } from "../../model/IItem";

const tableName = ItemCategory.TOY;
const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName}(
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    ageGroup INT NOT NULL,
    brand TEXT NOT NULL,
    material TEXT NOT NULL,
    batteryRequired BOOLEAN NOT NULL,
    educational BOOLEAN NOT NULL,
    price NUMERIC(2, 2) NOT NULL,
    quantity INT NOT NULL
)`;
const INSERT_ORDER = `INSERT INTO ${tableName} (id, type,ageGroup, brand, material, batteryRequired, educational, price, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = $1`;
const SELECT_ALL = `SELECT * FROM ${tableName}`;
const DELETE_BY_ID = `DELETE FROM ${tableName} WHERE id = $1`;
const UPDATE_ORDER = `UPDATE ${tableName} SET type = $1, ageGroup = $2, brand = $3, material = $4, batteryRequired = $5, educational = $6, price = $7, quantity = $8 WHERE id = $9`;

export class ToyRepository implements IRepository<IdentifiableToy>, Initializable {
    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE);
            logger.info("Toy Order Table initialized");
        } catch (error) {
            logger.error("Error initializing toy order table", error as Error);
            throw new InitializationException("Failed to initialize toy order table", error as Error);
        }
    }

    async create(item: IdentifiableToy): Promise<id> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(INSERT_ORDER, [
                item.getId(),
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.getBatteryRequired(),
                item.getEducational(),
                item.getPrice(),
                item.getQuantity()
        
            ]);
            return item.getId();
        } catch (error) {
            logger.error("Failed to create toy order", error as Error);
            throw new DbException("Failed to create toy order", error as Error);
        }
    }

    async get(id: id): Promise<IdentifiableToy> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query(SELECT_BY_ID, [id]);
            if (result.rows.length === 0) {
                throw new ItemNotFoundException(`Toy order with ID ${id} not found`);
            }
            return result.rows[0];
        } catch (error) {
            logger.error("Failed to get toy order", error as Error);
            throw new DbException("Failed to get toy order", error as Error);
        }
    }

    async getAll(): Promise<IdentifiableToy[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query(SELECT_ALL);
            return result.rows;
        } catch (error) {
            logger.error("Failed to get all toy orders", error as Error);
            throw new DbException("Failed to get all toy orders", error as Error);
        }
    }

    async update(item: IdentifiableToy): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(UPDATE_ORDER, [
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.getBatteryRequired(),
                item.getEducational(),
                item.getPrice(),
                item.getQuantity(),
                item.getId()
            ]);
        } catch (error) {
            logger.error("Failed to update toy order", error as Error);
            throw new DbException("Failed to update toy order", error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(DELETE_BY_ID, [id]);
        } catch (error) {
            logger.error("Failed to delete toy order", error as Error);
            throw new DbException("Failed to delete toy order", error as Error);
        }
    }
}
