import db from "@/db/index.ts";
import { posts, postMeta } from "@/db/schema.ts";
import { eq, desc, and, sql } from "drizzle-orm";

export type Post = typeof posts.$inferSelect;
export type PostMeta = typeof postMeta.$inferSelect;

export async function getAllPosts(): Promise<Post[]> {
  return db.select().from(posts).orderBy(desc(posts.created_at));
}

export async function getPublishedPosts(): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.created_at));
}

export async function findBySlug(slug: string): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.slug, slug));
  return row ?? null;
}

export async function findById(id: number): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.id, id));
  return row ?? null;
}

export async function createPost(data: {
  user_id: number;
  title: string;
  slug: string;
  content: string;
  published?: boolean;
}): Promise<Post> {
  const [row] = await db
    .insert(posts)
    .values({
      user_id: data.user_id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      published: data.published ?? false,
    })
    .returning();
  return row!;
}

export async function updatePost(
  id: number,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    published?: boolean;
  },
): Promise<Post | null> {
  const setValues: Record<string, unknown> = {
    updated_at: sql`now()`,
  };
  if (data.title !== undefined) setValues.title = data.title;
  if (data.slug !== undefined) setValues.slug = data.slug;
  if (data.content !== undefined) setValues.content = data.content;
  if (data.published !== undefined) setValues.published = data.published;

  if (Object.keys(setValues).length === 1) return findById(id);

  const [row] = await db
    .update(posts)
    .set(setValues)
    .where(eq(posts.id, id))
    .returning();
  return row ?? null;
}

export async function deletePost(id: number): Promise<void> {
  await db.delete(posts).where(eq(posts.id, id));
}

// Post Meta
export async function getMeta(postId: number): Promise<PostMeta[]> {
  return db.select().from(postMeta).where(eq(postMeta.post_id, postId));
}

export async function setMeta(
  postId: number,
  key: string,
  value: string,
): Promise<void> {
  await db
    .insert(postMeta)
    .values({ post_id: postId, meta_key: key, meta_value: value })
    .onConflictDoUpdate({
      target: [postMeta.post_id, postMeta.meta_key],
      set: { meta_value: value },
    });
}

export async function deleteMeta(postId: number, key: string): Promise<void> {
  await db
    .delete(postMeta)
    .where(and(eq(postMeta.post_id, postId), eq(postMeta.meta_key, key)));
}
