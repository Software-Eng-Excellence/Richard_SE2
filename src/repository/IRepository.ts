export type id = string

export interface ID{
    getId(): id;
}

export interface Initializable{
    /**
     * Initializes the repository, creating necessary tables or structures.
     * @returns A promise that resolves when the initialization is complete.
     * @throws {InitializationException} If initialization fails.
     * @throws {DbException} If a database error occurs during initialization.
     */
    init(): Promise<void>;
}
/**
 * Generic repository interface for managing items of type T.
 * 
 * @template T - The type of items in the repository, must extend ID
 */

export interface IRepository<T extends ID> {
    /**
     * Creates a new item in the repository.
     * 
     * @param item  The item to be created
     * @returns A promise that resolves to the id of the created item
     * @throws {InvalidItemException} If the item is invalid
     * @throws {DbException} throw when an error occurs while interacting with the database
    */
    create(item:T):Promise<id>;

    /**
     * Retrieves an item from the repository by its id.
     *
     * @param id  The id of the item to be retrieved
     * @returns A promise that resolves to the retrieved item
     * @throws {ItemNotFoundException} If the item is not found
    *  @throws {DbException} throw when an error occurs while interacting with the database 
    */
    get(id:id):Promise<T>; //T is the object data depend on T type


    /**
     * Retrieves all items from the repository.
     * 
     * @returns A promise that resolves to an array of all items
     * @throws {DbException} If an error occurs while retrieving items
    */
    getAll():Promise<T[]>;//T[] array 

    /**
     * Updates an existing item in the repository.
     * 
     * @param item  The item to be updated in the repository
     * @returns A promise that resolves when the item has been updated
     * @throws {InvalidItemException} If the item is invalid
     * @throws {ItemNotFoundException} If the item is not found
     * @throws {DbException} If an error occurs while updating the item 
    */
    update(item:T):Promise<void>;

    /**
     * Deletes an item from the repository.
     * 
     * @param id  The id of the item to be deleted
     * @returns A promise that resolves when the item has been deleted
     * @throws {ItemNotFoundException} If the item is not found
     * @throws {DbException} If an error occurs while deleting the item
    */

    delete(id:id):Promise<void>;
}

export interface InitializableRepository<T extends ID> extends IRepository<T> ,Initializable{
  
}