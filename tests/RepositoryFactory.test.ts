import { ItemCategory } from "../model/IItem";
import { DBMode, RepositoryFactory } from "../repository/Repository.factory";


jest.mock('../repository/file/Cake.order.repository');
jest.mock('../repository/file/Order.repository');
jest.mock('../repository/sqlite/Cake.order.repository');
jest.mock('../repository/sqlite/Order.repository');
jest.mock('../repository/Postgres/Cake.Order.repository');
jest.mock('../repository/Postgres/Order.repository');
jest.mock('../repository/Postgres/Book.Order.repository');
jest.mock('../repository/Postgres/Toy.Order.repository');

describe('RepositoryFactory', () => {
  describe('create', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });



    it('should handle FILE and CAKE combination', async () => {
      const repository = await RepositoryFactory.create(DBMode.FILE, ItemCategory.CAKE);
      expect(repository).toBeDefined();
    });

    it('should throw for FILE and BOOK combination', async () => {
      await expect(RepositoryFactory.create(DBMode.FILE, ItemCategory.BOOK)).rejects.toThrow();
    });

    it('should throw for FILE and TOY combination', async () => {
      await expect(RepositoryFactory.create(DBMode.FILE, ItemCategory.TOY)).rejects.toThrow();
    });

    it('should handle SQLITE and CAKE combination', async () => {
      const repository = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.CAKE);
      expect(repository).toBeDefined();
    });

    it('should throw for SQLITE and BOOK combination', async () => {
      await expect(RepositoryFactory.create(DBMode.SQLITE, ItemCategory.BOOK)).rejects.toThrow();
    });

    it('should throw for SQLITE and TOY combination', async () => {
      await expect(RepositoryFactory.create(DBMode.SQLITE, ItemCategory.TOY)).rejects.toThrow();
    });

    it('should handle POSTGRES and CAKE combination', async () => {
      const repository = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.CAKE);
      expect(repository).toBeDefined();
    });

    it('should handle POSTGRES and BOOK combination', async () => {
      const repository = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.BOOK);
      expect(repository).toBeDefined();
    });

    it('should handle POSTGRES and TOY combination', async () => {
      const repository = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.TOY);
      expect(repository).toBeDefined();
    });

    it('should throw for invalid mode', async () => {
      await expect(RepositoryFactory.create(99 as any, ItemCategory.CAKE)).rejects.toThrow();
    });
  });
});
