import db from "@/db/index.ts";
import { users } from "@/db/schema.ts";
import { eq, count as countFn } from "drizzle-orm";

export type User = typeof users.$inferSelect;

export function createUser(username: string, password: string): User {
  const password_hash = Bun.password.hashSync(password);
  return db.insert(users).values({ username, password_hash }).returning().get();
}

export function findByUsername(username: string): User | null {
  return (
    db.select().from(users).where(eq(users.username, username)).get() ?? null
  );
}

export function findById(id: number): User | null {
  return db.select().from(users).where(eq(users.id, id)).get() ?? null;
}

export function verifyPassword(user: User, password: string): boolean {
  return Bun.password.verifySync(password, user.password_hash);
}

// Seed a default admin user if none exist
const result = db.select({ cnt: countFn() }).from(users).get();
if (result && result.cnt === 0) {
  createUser("admin", "admin");
}
