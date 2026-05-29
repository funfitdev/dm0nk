import type { Post, PostMeta } from "@/db/posts.ts";

function CmsLayout({
  title,
  children,
  theme,
}: {
  title: string;
  children: JSX.Children;
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  return (
    <html class={isDark ? "dark" : ""}>
      <head>
        <title>{title} — CMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="min-h-screen bg-gray-100 dark:bg-gray-950">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a
              href="/admin/posts"
              class="text-lg font-bold text-gray-900 dark:text-gray-100"
            >
              CMS
            </a>
            <div class="flex items-center gap-4">
              <a
                href="/admin/posts"
                class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Posts
              </a>
              <form method="post" action="/logout" class="inline">
                <button
                  type="submit"
                  class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </nav>
        <main class="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

export function AdminIndex({
  posts,
  theme,
}: {
  posts: Post[];
  theme?: "light" | "dark";
}) {
  return (
    <CmsLayout title="Posts" theme={theme}>
      <div class="mb-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Posts
        </h1>
        <a
          href="/admin/posts/new"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Post
        </a>
      </div>
      {posts.length === 0 ? (
        <p class="text-gray-500 dark:text-gray-400">No posts yet.</p>
      ) : (
        <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <tr>
                <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                  Title
                </th>
                <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                  Slug
                </th>
                <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                  Created
                </th>
                <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr>
                  <td class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {post.title}
                  </td>
                  <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <a
                      href={`/posts/${post.slug}`}
                      class="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      /posts/{post.slug}
                    </a>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.published
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {post.created_at.toISOString().slice(0, 10)}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <a
                      href={`/admin/posts/${post.id}/edit`}
                      class="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Edit
                    </a>
                    <form
                      method="post"
                      action={`/admin/posts/${post.id}/delete`}
                      class="inline ml-3"
                    >
                      <button
                        type="submit"
                        class="text-sm text-red-600 hover:underline dark:text-red-400"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CmsLayout>
  );
}

export function AdminForm({
  theme,
  post,
  meta,
  error,
  values,
}: {
  theme?: "light" | "dark";
  post?: Post;
  meta?: PostMeta[];
  error?: string;
  values?: { title: string; slug: string; content: string; published: boolean };
}) {
  const isEdit = !!post;
  const title = values?.title ?? post?.title ?? "";
  const slug = values?.slug ?? post?.slug ?? "";
  const content = values?.content ?? post?.content ?? "";
  const published = values?.published ?? post?.published ?? false;
  const metaItems = meta || [];

  const formAction = isEdit ? `/admin/posts/${post!.id}` : "/admin/posts";

  return (
    <CmsLayout
      title={isEdit ? `Edit: ${post!.title}` : "New Post"}
      theme={theme}
    >
      <h1 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {isEdit ? "Edit Post" : "New Post"}
      </h1>
      {error && (
        <div class="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      <form method="post" action={formAction} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={slug}
            required
            pattern="[a-z0-9\\-]+"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Lowercase letters, numbers, and hyphens only.
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            name="content"
            rows="12"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            {content}
          </textarea>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            value="1"
            id="published"
            checked={published}
            class="rounded border-gray-300 dark:border-gray-600"
          />
          <label
            for="published"
            class="text-sm text-gray-700 dark:text-gray-300"
          >
            Published
          </label>
        </div>

        {/* Meta fields */}
        <fieldset class="border border-gray-200 rounded-md p-4 dark:border-gray-700">
          <legend class="px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Post Meta
          </legend>
          <div id="meta-fields" class="space-y-2">
            {metaItems.map((m) => (
              <div class="flex gap-2">
                <input
                  type="text"
                  name="meta_key"
                  value={m.meta_key}
                  placeholder="Key"
                  class="w-1/3 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
                <input
                  type="text"
                  name="meta_value"
                  value={m.meta_value}
                  placeholder="Value"
                  class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            ))}
            <div class="flex gap-2">
              <input
                type="text"
                name="meta_key"
                placeholder="Key"
                class="w-1/3 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <input
                type="text"
                name="meta_value"
                placeholder="Value"
                class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
        </fieldset>

        <div class="flex gap-3">
          <button
            type="submit"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isEdit ? "Update" : "Create"}
          </button>
          <a
            href="/admin/posts"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </a>
        </div>
      </form>
    </CmsLayout>
  );
}
