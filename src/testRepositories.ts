import { RepositoryFactory } from "./repository/Repository.factory";
import { DBMode } from "./config/type";
import { ItemCategory } from "./model/IItem";
import logger from "./util/logger";

/**
 * Test script to verify our database setup works correctly
 * Creates repositories for each item type and performs basic operations
 */
async function testRepositories() {
    try {
        console.log("Starting repository test...");
        logger.info("Testing repository creation...");
        
        // Test CAKE repository
        try {
            console.log("Testing CAKE repository...");
            const cakeRepo = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.CAKE);
            console.log("✅ CAKE repository created successfully");
        } catch (error) {
            console.error("❌ CAKE repository creation failed:", error);
            throw error;
        }
        
        // Test BOOK repository
        try {
            console.log("Testing BOOK repository...");
            const bookRepo = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.BOOK);
            console.log("✅ BOOK repository created successfully");
        } catch (error) {
            console.error("❌ BOOK repository creation failed:", error);
            throw error;
        }
        
        // Test TOY repository
        try {
            console.log("Testing TOY repository...");
            const toyRepo = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.TOY);
            console.log("✅ TOY repository created successfully");
        } catch (error) {
            console.error("❌ TOY repository creation failed:", error);
            throw error;
        }
        
        console.log("All repositories created successfully!");
        logger.info("All repositories created successfully!");
    } catch (error) {
        console.error("❌ Repository test failed:", error);
        logger.error("Repository test failed:", error);
        process.exit(1);
    }
}

// Run the test
testRepositories().then(() => {
    console.log("Repository test complete");
    logger.info("Repository test complete");
    process.exit(0);
}).catch(err => {
    console.error("Repository test failed:", err);
    logger.error("Repository test failed:", err);
    process.exit(1);
});
