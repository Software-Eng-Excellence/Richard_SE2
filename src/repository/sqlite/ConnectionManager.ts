import { Database, Statement, open } from "sqlite";
import sqlite3 from "sqlite3";
import config from "../../config";
import logger from "../../util/logger";
import { DbException } from "../../util/exceptions/repositoryException";
export class ConnectionManager{


    private static db: Database | null = null;
    private constructor(){}
    public static async getConnection(): Promise<Database> {
        if (this.db==null) {
            try{
                this.db = await open({ 
                    filename:  config.Storage.sqlite,
                    driver: sqlite3.Database 
                });
            }catch (error: unknown) {
                logger.error("Error opening database connection:", error as Error);
                throw new DbException("Failed to open database connection",error as Error);
            }
        }
        return this.db;
    }
}