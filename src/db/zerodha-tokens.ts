import db from "@/db/index.ts";
import { zerodhaTokens } from "@/db/schema.ts";
import { gt, desc } from "drizzle-orm";

export type ZerodhaToken = typeof zerodhaTokens.$inferSelect;
export type NewZerodhaToken = typeof zerodhaTokens.$inferInsert;

export async function saveZerodhaToken(
  values: NewZerodhaToken,
): Promise<ZerodhaToken> {
  const [row] = await db.insert(zerodhaTokens).values(values).returning();
  return row!;
}

// Latest token whose expiry is still in the future.
export async function getCurrentToken(): Promise<ZerodhaToken | null> {
  const [row] = await db
    .select()
    .from(zerodhaTokens)
    .where(gt(zerodhaTokens.expires_at, new Date()))
    .orderBy(desc(zerodhaTokens.created_at))
    .limit(1);
  return row ?? null;
}
