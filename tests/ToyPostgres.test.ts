import { ToyRepository } from "../repository/Postgres/Toy.Order.repository";
import { ConnectionManager } from "../repository/Postgres/ConnectionMananger";
import { IdentifiableToy } from "../model/Toy.models";
import { DbException, InitializationException, ItemNotFoundException } from "../util/exceptions/repositoryException";
import { Client } from "pg";


jest.mock("../repository/Postgres/ConnectionMananger");


const mockDb = {
    query: jest.fn(),
    end: jest.fn(),
    connect: jest.fn(),
    release: jest.fn(),
    port: 5432,
    host: "localhost",
    ssl: false,
    user: "test_user",
    database: "test_db",
    password: "test_password",
} as unknown as Client;

// Set up the mock for ConnectionManager
ConnectionManager.getConnection = jest.fn().mockResolvedValue(mockDb);

const mockToy: IdentifiableToy = new IdentifiableToy(
   "toy-123",
   "Action Figure",
   22,
   "gs",
   "ToyMakers Inc",
   true,
   true,
   19.99,
   200
);

const nullToy = new IdentifiableToy(
   "toy-123",
   "Action Figure",
   22,
   "gs",
   "ToyMakers Inc",
   true,
   true,
   19.99,
   200
 
);

describe("ToyOrderRepository", () => {
    let repo: ToyRepository;

    beforeEach(() => {
        repo = new ToyRepository();
        jest.clearAllMocks();
    });

    describe("Initialization", () => {
       

        it("should throw InitializationException if initialization fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repo.init()).rejects.toThrow(InitializationException);
        });
    });

    it("should create a toy successfully", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "toy-123" }] });
        await expect(repo.create(mockToy)).resolves.toEqual("toy-123");
    });

    it("should throw DbException if creation fails", async () => {
        (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Create Error"));
        await expect(repo.create(mockToy)).rejects.toThrow(DbException);
    });

    it("should handle null values when creating a toy", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "toy-123" }] });
        await expect(repo.create(nullToy)).resolves.toEqual("toy-123");
    });

    it("should retrieve a toy by ID successfully", async () => {
        const mockToyData = {
            id: "toy-123",
            name: "Action Figure",
            category: "Collectibles",
            price: 19.99,
            manufacturer: "ToyMakers Inc",
            agerange: "6+",
            material: "Plastic",
            color: "Blue",
            instock: true,
            features: "Battery operated"
        };
        
       
    });

    it("should throw DbException if toy ID is not found", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
        await expect(repo.get("99")).rejects.toThrow(DbException);
    });

    it("should retrieve all toys successfully", async () => {
        const mockRows = [
            {
                id: "toy-123",
                name: "Action Figure",
                category: "Collectibles",
                price: 19.99,
                manufacturer: "ToyMakers Inc",
                agerange: "6+",
                material: "Plastic",
                color: "Blue",
                instock: true,
                features: "Battery operated"
            },
            {
                id: "toy-456",
                name: "Teddy Bear",
                category: "Plush",
                price: 14.99,
                manufacturer: "ToyMakers Inc",
                agerange: "3+",
                material: "Cotton",
                color: "Brown",
                instock: true,
                features: "Soft"
            }
        ];
        
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: mockRows });
        const toys = await repo.getAll();
        expect(toys).toHaveLength(2);
    });

    it("should return an empty array when no toys exist", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
        const toys = await repo.getAll();
        expect(toys).toEqual([]);
    });

    it("should throw DbException if getAll query fails", async () => {
        (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
        await expect(repo.getAll()).rejects.toThrow(DbException);
    });

    it("should update a toy successfully", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({});
        await expect(repo.update(mockToy)).resolves.not.toThrow();
    });

    it("should throw DbException if update fails", async () => {
        (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Update Error"));
        await expect(repo.update(mockToy)).rejects.toThrow(DbException);
    });

    it("should delete a toy successfully", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({});
        await expect(repo.delete("toy-123")).resolves.not.toThrow();
    });

    it("should throw DbException if delete fails", async () => {
        (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Delete Error"));
        await expect(repo.delete("toy-123")).rejects.toThrow(DbException);
    });
});
