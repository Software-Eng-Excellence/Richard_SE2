import { Database, open } from "sqlite";
import * as sqlite3 from "sqlite3";
import config from "../../config";
import logger from "../../util/logger";
import { DbException } from "../../util/exceptions/repositoryException";
import path from "path";

export class ConnectionManager {
    private static db: Database | null = null;
    
    private constructor() {}
    
    public static async getConnection(): Promise<Database> {
        if (this.db == null) {
            try {
                // Ensure absolute path for SQLite file
                const dbPath = config.Storage.sqlite;
                logger.info(`Opening SQLite database at: ${dbPath}`);
                
                this.db = await open({
                    filename: dbPath,
                    driver: sqlite3.Database
                });
                
                logger.info("Database connection established successfully");
            } catch (error: unknown) {
                logger.error("Error opening database connection:", error);
                throw new DbException("Failed to open database connection", error as Error);
            }
        }
        return this.db;
    }
}