import fs from "fs";
import path from "path";
import logger from "../util/logger";

// CSV inside src folder
const defaultCsvPath = path.join(__dirname, "cake_orders.csv");

export const parseCSV = (filePath: string = defaultCsvPath): Promise<string[][]> => {
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

