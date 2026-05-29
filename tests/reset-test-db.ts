import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const url = process.env.TEST_DATABASE_URL;
if (!url) {
  console.error("TEST_DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(url);
await sql`DROP SCHEMA IF EXISTS public CASCADE`;
await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`;
await sql`CREATE SCHEMA public`;
await sql.end();

// Pre-apply migrations and seed admin. The webServer's startup migrate
// + seed work correctly in production (Docker) but writes at top-level
// init don't persist when the process is launched by Playwright's
// webServer launcher. Doing it here in a separate Bun process avoids
// that interaction; the server's own migrate then no-ops on the
// recorded hash and the seed sees the admin row already in place.
const migrateClient = postgres(url, { max: 1 });
const db = drizzle(migrateClient);
await migrate(db, { migrationsFolder: "./drizzle" });
const pw = Bun.password.hashSync("admin");
await migrateClient`INSERT INTO auth_users (username, password_hash) VALUES ('admin', ${pw}) ON CONFLICT (username) DO NOTHING`;
await migrateClient.end();
