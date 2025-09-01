import { BookRepository } from "../repository/Postgres/Book.Order.repository";
import { ConnectionManager } from "../repository/Postgres/ConnectionMananger";
import { IdentifiableBook } from "../model/Book.models";
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


ConnectionManager.getConnection = jest.fn().mockResolvedValue(mockDb);

const mockBook: IdentifiableBook = new IdentifiableBook(
    "book-123", 
    "The Great Novel",
    "John Author", 
    "123-456-789", 
    "Sample Publisher",
    "English", 
    "Elios", 
     "2024",
     "rikr"
);

const nullBook = new IdentifiableBook(
    "book-123",
    "The Great Novel",
    "J",
    "123-456-789",
    "Sample Publisher",
    "English",
    "Elios",
    "2024",
    "rikr"
);

describe("BookRepository", () => {
    let repo: BookRepository;

    beforeEach(() => {
        repo = new BookRepository();
        jest.clearAllMocks();
    });

    describe("Initialization", () => {
     

        it("should throw InitializationException if initialization fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repo.init()).rejects.toThrow(InitializationException);
        });
    });

    it("should create a book successfully", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "book-123" }] });
        await expect(repo.create(mockBook)).resolves.toEqual("book-123");
    });

    it("should throw DbException if creation fails", async () => {
        (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Create Error"));
        await expect(repo.create(mockBook)).rejects.toThrow(DbException);
    });

    it("should handle null values when creating a book", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "book-123" }] });
        await expect(repo.create(nullBook)).resolves.toEqual("book-123");
    });



    it("should throw DbException if book ID is not found", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
        await expect(repo.get("99")).rejects.toThrow(DbException);
    });

    it("should retrieve all books successfully", async () => {
        const mockRows = [
            {
                id: "book-123",
                title: "The Great Novel",
                author: "John Author",
                isbn: "123-456-789",
                publisher: "Sample Publisher",
                publicationdate: "2023-01-01",
                genre: "Fiction",
                pages: 350,
                language: "English",
                description: "A compelling story about...",
                price: 29.99
            },
            {
                id: "book-456",
                title: "Another Book",
                author: "Jane Writer",
                isbn: "987-654-321",
                publisher: "Other Publisher",
                publicationdate: "2022-05-15",
                genre: "Non-Fiction",
                pages: 250,
                language: "English",
                description: "An informative guide to...",
                price: 19.99
            }
        ];
        
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: mockRows });
        const books = await repo.getAll();
        expect(books).toHaveLength(2);
    });

    it("should return an empty array when no books exist", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
        const books = await repo.getAll();
        expect(books).toEqual([]);
    });

    it("should throw DbException if getAll query fails", async () => {
        (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
        await expect(repo.getAll()).rejects.toThrow(DbException);
    });

    it("should update a book successfully", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({});
        await expect(repo.update(mockBook)).resolves.not.toThrow();
    });

    it("should throw DbException if update fails", async () => {
        (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Update Error"));
        await expect(repo.update(mockBook)).rejects.toThrow(DbException);
    });

    it("should delete a book successfully", async () => {
        (mockDb.query as jest.Mock).mockResolvedValueOnce({});
        await expect(repo.delete("book-123")).resolves.not.toThrow();
    });

    it("should throw DbException if delete fails", async () => {
        (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Delete Error"));
        await expect(repo.delete("1")).rejects.toThrow(DbException);
    });
});
