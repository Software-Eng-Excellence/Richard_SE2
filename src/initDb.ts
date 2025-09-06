import { Database, open } from "sqlite";
import * as sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

// Ensure the data directory exists
const dataDir = path.resolve(__dirname, "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Path to the database file
const dbPath = path.resolve(__dirname, "data", "order.db");
console.log(`Database path: ${dbPath}`);

// SQL statements to create tables
const createTables = async () => {
    try {
        console.log("Starting database initialization...");
        console.log(`Current directory: ${__dirname}`);
        console.log(`Database directory: ${dataDir}`);
        
        // Delete the existing database file if it exists
        if (fs.existsSync(dbPath)) {
            console.log(`Removing existing database file: ${dbPath}`);
            fs.unlinkSync(dbPath);
        } else {
            console.log(`No existing database file found at: ${dbPath}`);
        }
        
        // Open SQLite database connection using better-sqlite3
        console.log("Opening database connection...");
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        console.log("Database connection opened successfully");
        
        // Create the order table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS "order" (
                id TEXT PRIMARY KEY,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                item_category TEXT NOT NULL,
                item_id TEXT NOT NULL
            )
        `);
        console.log("Order table created successfully");
        
        // Create the cake table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS cake (
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
            )
        `);
        console.log("Cake table created successfully");

        // Create the book table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS book (
                id TEXT PRIMARY KEY,
                bookTitle TEXT NOT NULL,
                author TEXT NOT NULL,
                genre TEXT NOT NULL,
                format TEXT NOT NULL,
                language TEXT NOT NULL,
                publisher TEXT NOT NULL,
                specialEdition TEXT NOT NULL,
                packaging TEXT NOT NULL
            )
        `);
        console.log("Book table created successfully");

        // Create the toy table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS toy (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                ageGroup INTEGER NOT NULL,
                brand TEXT NOT NULL,
                material TEXT NOT NULL,
                batteryRequired INTEGER NOT NULL,
                educational INTEGER NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL
            )
        `);
        console.log("Toy table created successfully");
        
        // Close the database connection
        await db.close();
        console.log("Database closed");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

createTables();
