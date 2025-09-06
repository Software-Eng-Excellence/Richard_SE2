
import { ItemCategory } from "../model/IItem";
import { IIdentifiableOrderItem} from "../model/IOrder";
import { OrderRepository } from "./sqlite/Order.repository";
import { Initializable, IRepository } from "./IRepository";
import { CakeRepository } from "./sqlite/Cake.order.repository";
import { BookRepository } from "./Postgres/Book.Order.repository";
import { ToyRepository } from "./Postgres/Toy.Order.repository";
import {CakeRepositoryPostgress} from "./Postgres/Cake.Order.repository";
import { OrderRepositoryPostgres } from "./Postgres/Order.repository";
import { DBMode } from "../config/type";




export class RepositoryFactory {
    /**
     * Creates a repository for the specified database mode and item category
     * @param mode Database mode (SQLITE, FILE, POSTGRES)
     * @param category Item category (CAKE, BOOK, TOY)
     * @returns An appropriate repository instance
     */
    public static async create(mode: DBMode, category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        let repository: IRepository<IIdentifiableOrderItem> & Initializable;
        
        switch (mode) {
            case DBMode.SQLITE:
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
                        throw new Error("Invalid item category for SQLite");
                }
                await repository.init();
                return repository;
                   
            
            case DBMode.POSTGRES:
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepositoryPostgres(new CakeRepositoryPostgress());
                        break;
                    case ItemCategory.BOOK:
                        repository = new OrderRepositoryPostgres(new BookRepository());
                        break;
                    case ItemCategory.TOY:
                        repository = new OrderRepositoryPostgres(new ToyRepository());
                        break;
                    default:
                        throw new Error("Invalid item category for Postgres");
                }
                await repository.init();
                return repository;
            // Deprecated
            case DBMode.FILE:
                throw new Error("File repository is Deprecated");

            default:
                throw new Error("Invalid DB mode");
        }
    }
}
