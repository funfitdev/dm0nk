import db from "@/db/index.ts";
import { users } from "@/db/schema.ts";
import { eq, count as countFn } from "drizzle-orm";

export type User = typeof users.$inferSelect;

export async function createUser(
  username: string,
  password: string,
): Promise<User> {
  const password_hash = Bun.password.hashSync(password);
  const [row] = await db
    .insert(users)
    .values({ username, password_hash })
    .returning();
  return row!;
}

export async function findByUsername(username: string): Promise<User | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return row ?? null;
}

export async function findById(id: number): Promise<User | null> {
  const [row] = await db.select().from(users).where(eq(users.id, id));
  return row ?? null;
}

export function verifyPassword(user: User, password: string): boolean {
  return Bun.password.verifySync(password, user.password_hash);
}

// Seed a default admin user if none exist
const [seedResult] = await db.select({ cnt: countFn() }).from(users);
if (seedResult && Number(seedResult.cnt) === 0) {
  await createUser("admin", "admin");
}
