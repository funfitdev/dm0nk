import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";
import * as schema from "@/db/schema.ts";

const sqlite = new Database(process.env.DB_PATH ?? "cms.db", { create: true });
sqlite.run("PRAGMA journal_mode = WAL");
sqlite.run("PRAGMA foreign_keys = ON");

const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: "./drizzle" });

export default db;
