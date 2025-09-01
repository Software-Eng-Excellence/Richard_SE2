import config from "../config";
import { ItemCategory } from "../model/IItem";
import { IOrder } from "../model/IOrder";
import { CakeOrderRepository } from "./file/Cake.order.repository";
import { OrderRepository } from "./sqlite/Order.repository";
import { Initializable, IRepository } from "./IRepository";
import { CakeRepository } from "./sqlite/Cake.order.repository";
import { BookRepository } from "./Postgres/Book.Order.repository";
import { ToyRepository } from "./Postgres/Toy.Order.repository";


export enum DBMode {
    SQLITE,
    FILE,
    POSTGRES
}
export class RepositoryFactory {
    /**
     * Creates a repository for the specified database mode and item category
     * @param mode Database mode (SQLITE, FILE, POSTGRES)
     * @param category Item category (CAKE, BOOK, TOY)
     * @returns An appropriate repository instance
     */
    public static async create(mode: DBMode, category: ItemCategory): Promise<IRepository<IOrder>> {
        let repository: IRepository<IOrder> & Initializable;
        
        switch (mode) {
            case DBMode.SQLITE:
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepository(new CakeRepository());
                        break;
                    case ItemCategory.BOOK:
                        // If you have SQLite implementations for Book, use them here
                        throw new Error("SQLite repository not implemented for Book");
                    case ItemCategory.TOY:
                        // If you have SQLite implementations for Toy, use them here
                        throw new Error("SQLite repository not implemented for Toy");
                    default:
                        throw new Error("Invalid item category for SQLite");
                }
                await repository.init();
                return repository;
                
            case DBMode.FILE:
                switch (category) {
                    case ItemCategory.CAKE:
                        return new CakeOrderRepository(config.Storage.csv.cake);
                    case ItemCategory.BOOK:
                        // If you have file repositories for Book, use them here
                        throw new Error("File repository not implemented for Book");
                    case ItemCategory.TOY:
                        // If you have file repositories for Toy, use them here
                        throw new Error("File repository not implemented for Toy");
                    default:
                        throw new Error("Invalid item category for File");
                }
            
            case DBMode.POSTGRES:
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepository(new CakeRepository());
                        break;
                    case ItemCategory.BOOK:
                        repository = new OrderRepository(new BookRepository());
                        break;
                    case ItemCategory.TOY:
                        repository = new OrderRepository(new ToyRepository());
                        break;
                    default:
                        throw new Error("Invalid item category for Postgres");
                }
                await repository.init();
                return repository;
                
            default:
                throw new Error("Invalid DB mode");
        }
    }
}
