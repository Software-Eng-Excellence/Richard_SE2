import fs from "fs";
import path from "path";
import logger from "../util/logger";

// CSV inside src folder
const defaultCsvPath = path.join(__dirname, "cake_orders.csv");

export const readCSVFile = (filePath: string = defaultCsvPath): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
        const results: string[][] = [];

        if (!fs.existsSync(filePath)) {
            const err = new Error(`CSV file not found at path: ${filePath}`);
            logger.error(err.message);
            return reject(err);
        }

        const readStream = fs.createReadStream(filePath, { encoding: "utf-8" });

        readStream.on("data", (chunk: string | Buffer) => {
            const lines = chunk.toString().split("\n").filter(line => line.trim() !== "");
            lines.forEach(line => {
                const columns = line.split(",").map(value => value.trim().replace(/^"(.*)"$/, "$1"));
                results.push(columns);
            });
        });

        readStream.on("end", () => resolve(results));
        readStream.on("error", error => {
            logger.error("Error while reading the file %s: %o", filePath, error);
            reject(error);
        });
    });
    
};
export const writeCSVFile = (filePath: string, data: string[][]): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            // Convert data array to CSV format
            const csvContent = data.map(row =>
                row.map(cell =>
                        // Handle cells with commas by wrapping in quotes
                        cell.includes(',') ? `"${cell}"` : cell
                    ).join(',')
                ).join('\n');
                
                // Write to file
                const writeStream = fs.createWriteStream(filePath);
                
                writeStream.write(csvContent);
                writeStream.end();
                
                writeStream.on('finish', () => {
                    logger.info(`CSV file successfully written to ${filePath}`);
                    resolve();
                });
                
                writeStream.on('error', (error) => {
                    logger.error(`Error writing CSV file to ${filePath}: %o`, error);
                    reject(error);
                });
            } catch (error) {
                logger.error(`Error preparing CSV data: %o`, error);
                reject(error);
            }
        });
};
