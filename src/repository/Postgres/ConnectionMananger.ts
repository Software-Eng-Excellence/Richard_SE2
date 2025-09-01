
import config from "../../config";
import logger from "../../util/logger";
import { DbException } from "../../util/exceptions/repositoryException";
import { Pool, PoolClient } from 'pg';

export class ConnectionManager {
    private static pool: Pool | null = null;
    
    private constructor() {}
    
    public static async getConnection(): Promise<PoolClient> {
        if (this.pool === null) {
            try {
                this.pool = new Pool({
                    user: config.Storage.postgres.user,
                    host: config.Storage.postgres.host,
                    database: config.Storage.postgres.database,
                    password: config.Storage.postgres.password,
                    ssl: config.Storage.postgres.ssl,
                });

               
            } catch (error: unknown) {
                logger.error("Error creating database pool:", error as Error);
                throw new DbException("Failed to create database pool", error as Error);
            }
        }
        
        try {
            return await this.pool.connect();
        } catch (error: unknown) {
            logger.error("Error acquiring client from pool:", error as Error);
            throw new DbException("Failed to acquire database connection", error as Error);
        }
    }
}