import db from "@/db/index.ts";
import { posts, postMeta } from "@/db/schema.ts";
import { eq, desc, and, sql } from "drizzle-orm";

export type Post = typeof posts.$inferSelect;
export type PostMeta = typeof postMeta.$inferSelect;

export function getAllPosts(): Post[] {
  return db.select().from(posts).orderBy(desc(posts.created_at)).all();
}

export function getPublishedPosts(): Post[] {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, 1))
    .orderBy(desc(posts.created_at))
    .all();
}

export function findBySlug(slug: string): Post | null {
  return db.select().from(posts).where(eq(posts.slug, slug)).get() ?? null;
}

export function findById(id: number): Post | null {
  return db.select().from(posts).where(eq(posts.id, id)).get() ?? null;
}

export function createPost(data: {
  user_id: number;
  title: string;
  slug: string;
  content: string;
  published?: number;
}): Post {
  return db
    .insert(posts)
    .values({
      user_id: data.user_id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      published: data.published ?? 0,
    })
    .returning()
    .get();
}

export function updatePost(
  id: number,
  data: { title?: string; slug?: string; content?: string; published?: number },
): Post | null {
  const setValues: Record<string, unknown> = {
    updated_at: sql`datetime('now')`,
  };
  if (data.title !== undefined) setValues.title = data.title;
  if (data.slug !== undefined) setValues.slug = data.slug;
  if (data.content !== undefined) setValues.content = data.content;
  if (data.published !== undefined) setValues.published = data.published;

  if (Object.keys(setValues).length === 1) return findById(id);

  return (
    db.update(posts).set(setValues).where(eq(posts.id, id)).returning().get() ??
    null
  );
}

export function deletePost(id: number): void {
  db.delete(posts).where(eq(posts.id, id)).run();
}

// Post Meta
export function getMeta(postId: number): PostMeta[] {
  return db.select().from(postMeta).where(eq(postMeta.post_id, postId)).all();
}

export function setMeta(postId: number, key: string, value: string): void {
  db.insert(postMeta)
    .values({ post_id: postId, meta_key: key, meta_value: value })
    .onConflictDoUpdate({
      target: [postMeta.post_id, postMeta.meta_key],
      set: { meta_value: value },
    })
    .run();
}

export function deleteMeta(postId: number, key: string): void {
  db.delete(postMeta)
    .where(and(eq(postMeta.post_id, postId), eq(postMeta.meta_key, key)))
    .run();
}
