import type { Post, PostMeta } from "@/db/posts.ts";

export function Show({
  post,
  meta,
  theme,
}: {
  post: Post;
  meta: PostMeta[];
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  const description =
    meta.find((m) => m.meta_key === "description")?.meta_value || "";

  return (
    <html class={isDark ? "dark" : ""}>
      <head>
        <title>{post.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {description && <meta name="description" content={description} />}
        {meta
          .filter((m) => m.meta_key.startsWith("og:"))
          .map((m) => (
            <meta property={m.meta_key} content={m.meta_value} />
          ))}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="min-h-screen bg-white dark:bg-gray-950">
        <article class="mx-auto max-w-3xl px-4 py-12">
          <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {post.title}
            </h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Published {post.created_at.toISOString().slice(0, 10)}
              {post.updated_at.getTime() !== post.created_at.getTime() &&
                ` · Updated ${post.updated_at.toISOString().slice(0, 10)}`}
            </p>
          </header>
          <div class="prose prose-gray max-w-none dark:prose-invert whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
            {post.content}
          </div>
        </article>
      </body>
    </html>
  );
}
