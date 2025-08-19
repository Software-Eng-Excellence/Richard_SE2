import fs from "fs";
import os from "os";
import path from "path";
import logger from "../util/logger";
import { parseCSV } from "../parsers/csvParser";


jest.mock("../util/logger", () => ({
  __esModule: true,
  default: { error: jest.fn() },
}));


describe("parseCSV", () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "csvParser-tests-"));
  const createdFiles: string[] = [];

  const writeTempCSV = (content: string, name = `file-${Date.now()}-${Math.random()}.csv`) => {
    const p = path.join(tmpRoot, name);
    fs.writeFileSync(p, content, "utf8");
    createdFiles.push(p);
    return p;
  };

  afterAll(() => {
    for (const f of createdFiles) {
      try { fs.unlinkSync(f); } catch {}
    }
    try { fs.rmdirSync(tmpRoot); } catch {}
  });

  it("parses a simple CSV with trimming and quoted values", async () => {
    const csv = [
      "id, name, price",
      `"1", "Chocolate", "10.50"`,
      "2, Vanilla, 7",
      "",
    ].join("\n");
    const fp = writeTempCSV(csv);

    const rows = await parseCSV(fp);

    expect(rows).toEqual([
      ["id", "name", "price"],
      ["1", "Chocolate", "10.50"],
      ["2", "Vanilla", "7"],
    ]);
  });

  it("ignores empty or whitespace-only lines", async () => {
    const csv = ["name,age", "", "   ", "Alice,30", "\n"].join("\n");
    const fp = writeTempCSV(csv);

    const rows = await parseCSV(fp);

    expect(rows).toEqual([
      ["name", "age"],
      ["Alice", "30"],
    ]);
  });

  it("rejects when file does not exist and logs an error", async () => {
    const missing = path.join(tmpRoot, "does-not-exist.csv");

    await expect(parseCSV(missing)).rejects.toThrow(/CSV file not found/);

    expect((logger as any).default?.error || (logger as any).error).toHaveBeenCalled();
    const loggedArg =
      ((logger as any).default?.error || (logger as any).error).mock.calls[0][0];
    expect(loggedArg).toMatch(/CSV file not found at path:/);
  });
}); 