import db from "@/db/index.ts";
import { sessions } from "@/db/schema.ts";
import { eq } from "drizzle-orm";

export type Session = typeof sessions.$inferSelect;

export async function createSession(userId: number): Promise<Session> {
  const id = crypto.randomUUID();
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ id, user_id: userId, expires_at });
  return { id, user_id: userId, expires_at };
}

export async function findSession(id: string): Promise<Session | null> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, id));
  if (!session) return null;
  if (session.expires_at < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return null;
  }
  return session;
}

export async function deleteSession(id: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, id));
}
