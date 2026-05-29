import db from "@/db/index.ts";
import { sessions } from "@/db/schema.ts";
import { eq } from "drizzle-orm";

export type Session = typeof sessions.$inferSelect;

export function createSession(userId: number): Session {
  const id = crypto.randomUUID();
  const expires_at = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  db.insert(sessions).values({ id, user_id: userId, expires_at }).run();
  return { id, user_id: userId, expires_at };
}

export function findSession(id: string): Session | null {
  const session = db.select().from(sessions).where(eq(sessions.id, id)).get();
  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    db.delete(sessions).where(eq(sessions.id, id)).run();
    return null;
  }
  return session;
}

export function deleteSession(id: string): void {
  db.delete(sessions).where(eq(sessions.id, id)).run();
}
