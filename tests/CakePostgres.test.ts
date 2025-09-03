import { CakeRepository } from "../repository/Postgres/Cake.Order.repository";
import { ConnectionManager } from "../repository/Postgres/ConnectionMananger";
import { IdentifiableCake } from "../model/Cake.model";
import { DbException, InitializationException, ItemNotFoundException } from "../util/exceptions/repositoryException";
import { Client } from "pg";
import logger from "../util/logger";


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

const mockCake: IdentifiableCake = new IdentifiableCake(
  "cake-123", 
  "Birthday Cake", 
  "Chocolate", 
  "Vanilla Cream",
  8, 
  2,
  "Buttercream", 
  "Vanilla",
  "Sprinkles", 
  "Rainbow", 
  "Happy Birthday!",
  "Round", 
  "Nuts", 
  "Organic Cocoa", 
  "Box" 
);

const nullCake = new IdentifiableCake(
  "cake-123",
  "Birthday Cake",
  "Chocolate",
  "Vanilla Cream",
  8,
  2,
  "Buttercream",
  "Vanilla",
  "Sprinkles",
  "Rainbow",
  "",                 
  "Round",             
  "",                  
  "",                  
  "Box"                
);



describe("CakeRepository", () => {
  let repo: CakeRepository;

  beforeEach(() => {
    repo = new CakeRepository();
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize the cake table successfully and log the message", async () => {
      // Mocking the query to resolve successfully
      (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);

      // Spy on the logger's info method to check if it's called with the expected message
      const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => logger);

      // Run the init method
      await repo.init();

      // Expect the logger to have been called with the correct message
      expect(infoSpy).toHaveBeenCalledWith("Cake table initialized");
      
      // Clean up the spy
      infoSpy.mockRestore();
    });

    it("should throw InitializationException if initialization fails", async () => {
      (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
      await expect(repo.init()).rejects.toThrow(InitializationException);
    });
  });


    it("should create a cake successfully", async () => {
      (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "cake-123" }] });
      await expect(repo.create(mockCake)).resolves.toEqual("cake-123");
    });

    it("should throw DbException if creation fails", async () => {
      (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Create Error"));
      await expect(repo.create(mockCake)).rejects.toThrow(DbException);
    });

    it("should handle null values when creating a cake", async () => {
      (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "cake-123" }] });
      await expect(repo.create(nullCake)).resolves.toEqual("cake-123");
    });
  

  
    it("should retrieve a cake by ID successfully", async () => {
      // Mock the raw data that comes from PostgreSQL
      const mockCakeData = {
        id: "cake-123",
        type: "Birthday Cake",
        flavor: "Chocolate",
        filling: "Vanilla Cream",
        size: 8,
        layers: 2,
        frostingtype: "Buttercream",
        frostingflavor: "Vanilla",
        decorationtype: "Sprinkles",
        decorationcolor: "Rainbow",
        custommessage: "Happy Birthday!",
        shape: "Round",
        allergies: "Nuts",
        specialingredients: "Organic Cocoa",
        packagingtype: "Box"
      };
      
      (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockCakeData] });
      const cake = await repo.get("cake-123");
      expect(cake).toBeDefined();
      expect(cake.getId()).toEqual("cake-123");
    });

    it("should throw DbException if cake ID is not found", async () => {
      (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      await expect(repo.get("99")).rejects.toThrow(DbException);
    });

    it("should retrieve all cakes successfully", async () => {
      // Mock the raw data that comes from PostgreSQL
      const mockRows = [
        {
          id: "cake-123",
          type: "Birthday Cake",
          flavor: "Chocolate",
          filling: "Vanilla Cream",
          size: 8,
          layers: 2,
          frostingtype: "Buttercream",
          frostingflavor: "Vanilla",
          decorationtype: "Sprinkles",
          decorationcolor: "Rainbow",
          custommessage: "Happy Birthday!",
          shape: "Round",
          allergies: "Nuts",
          specialingredients: "Organic Cocoa",
          packagingtype: "Box"
        },
        {
          id: "cake-456",
          type: "Birthday Cake",
          flavor: "Chocolate",
          filling: "Vanilla Cream",
          size: 8,
          layers: 2,
          frostingtype: "Buttercream",
          frostingflavor: "Vanilla",
          decorationtype: "Sprinkles",
          decorationcolor: "Rainbow",
          custommessage: "Happy Birthday!",
          shape: "Round",
          allergies: "Nuts",
          specialingredients: "Organic Cocoa",
          packagingtype: "Box"
        }
      ];
      
      (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: mockRows });
      const cakes = await repo.getAll();
      expect(cakes).toHaveLength(2);
    });

    it("should return an empty array when no cakes exist", async () => {
      (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const cakes = await repo.getAll();
      expect(cakes).toEqual([]);
    });

    it("should throw DbException if getAll query fails", async () => {
      (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
      await expect(repo.getAll()).rejects.toThrow(DbException);
    });
  

 
    it("should update a cake order successfully", async () => {
      (mockDb.query as jest.Mock).mockResolvedValueOnce({});
      await expect(repo.update(mockCake)).resolves.not.toThrow();
    });

    it("should throw DbException if update fails", async () => {
      (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Update Error"));
      await expect(repo.update(mockCake)).rejects.toThrow(DbException);
    });

    it("should delete a cake successfully", async () => {
      (mockDb.query as jest.Mock).mockResolvedValueOnce({});
      await expect(repo.delete("cake-123")).resolves.not.toThrow();
    });

    it("should throw DbException if delete fails", async () => {
      (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Delete Error"));
      await expect(repo.delete("1")).rejects.toThrow(DbException);
    });
  });