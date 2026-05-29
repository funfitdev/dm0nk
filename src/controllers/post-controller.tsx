import { render } from "@/utils/render.tsx";
import { getTheme } from "@/utils/cookie.tsx";
import { requireAuth } from "@/utils/auth.ts";
import * as Posts from "@/db/posts.ts";
import * as PostView from "@/views/post-view.tsx";

// GET /admin/posts — list all posts
export async function index(req: Request) {
  const user = requireAuth(req);
  if (user instanceof Response) return user;
  const theme = getTheme(req);
  const posts = Posts.getAllPosts();
  return render(<PostView.AdminIndex posts={posts} theme={theme} />);
}

// GET /admin/posts/new — new post form
export async function new_(req: Request) {
  const user = requireAuth(req);
  if (user instanceof Response) return user;
  const theme = getTheme(req);
  return render(<PostView.AdminForm theme={theme} />);
}

// POST /admin/posts — create post
export async function create(req: Request) {
  const user = requireAuth(req);
  if (user instanceof Response) return user;
  const theme = getTheme(req);
  const form = await req.formData();
  const title = (form.get("title") as string) || "";
  const slug = (form.get("slug") as string) || "";
  const content = (form.get("content") as string) || "";
  const published = form.get("published") === "1" ? 1 : 0;

  if (!title || !slug) {
    return render(
      <PostView.AdminForm
        theme={theme}
        error="Title and slug are required."
        values={{ title, slug, content, published }}
      />,
    );
  }

  const existing = Posts.findBySlug(slug);
  if (existing) {
    return render(
      <PostView.AdminForm
        theme={theme}
        error="A post with that slug already exists."
        values={{ title, slug, content, published }}
      />,
    );
  }

  const post = Posts.createPost({
    user_id: user.id,
    title,
    slug,
    content,
    published,
  });

  // Save meta fields
  const metaKeys = form.getAll("meta_key") as string[];
  const metaValues = form.getAll("meta_value") as string[];
  for (let i = 0; i < metaKeys.length; i++) {
    if (metaKeys[i]) Posts.setMeta(post.id, metaKeys[i], metaValues[i] || "");
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/admin/posts" },
  });
}

// GET /admin/posts/:id/edit — edit form
export async function edit(req: Request) {
  const user = requireAuth(req);
  if (user instanceof Response) return user;
  const theme = getTheme(req);
  const url = new URL(req.url);
  const id = Number(url.pathname.split("/")[3]);
  const post = Posts.findById(id);
  if (!post) return new Response("Not found", { status: 404 });
  const meta = Posts.getMeta(post.id);
  return render(<PostView.AdminForm theme={theme} post={post} meta={meta} />);
}

// PUT /admin/posts/:id — update post
export async function update(req: Request) {
  const user = requireAuth(req);
  if (user instanceof Response) return user;
  const theme = getTheme(req);
  const url = new URL(req.url);
  const id = Number(url.pathname.split("/")[3]);
  const post = Posts.findById(id);
  if (!post) return new Response("Not found", { status: 404 });

  let form = await req.formData();
  const title = (form.get("title") as string) || "";
  const slug = (form.get("slug") as string) || "";
  const content = (form.get("content") as string) || "";
  const published = form.get("published") === "1" ? 1 : 0;

  if (!title || !slug) {
    const meta = Posts.getMeta(post.id);
    return render(
      <PostView.AdminForm
        theme={theme}
        post={post}
        meta={meta}
        error="Title and slug are required."
        values={{ title, slug, content, published }}
      />,
    );
  }

  const slugConflict = Posts.findBySlug(slug);
  if (slugConflict && slugConflict.id !== id) {
    const meta = Posts.getMeta(post.id);
    return render(
      <PostView.AdminForm
        theme={theme}
        post={post}
        meta={meta}
        error="A post with that slug already exists."
        values={{ title, slug, content, published }}
      />,
    );
  }

  Posts.updatePost(id, { title, slug, content, published });

  // Update meta - clear old, set new
  const oldMeta = Posts.getMeta(id);
  for (const m of oldMeta) Posts.deleteMeta(id, m.meta_key);
  const metaKeys = form.getAll("meta_key") as string[];
  const metaValues = form.getAll("meta_value") as string[];
  for (let i = 0; i < metaKeys.length; i++) {
    if (metaKeys[i]) Posts.setMeta(id, metaKeys[i], metaValues[i] || "");
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/admin/posts" },
  });
}

// DELETE /admin/posts/:id
export async function delete_(req: Request) {
  const user = requireAuth(req);
  if (user instanceof Response) return user;
  const url = new URL(req.url);
  const id = Number(url.pathname.split("/")[3]);
  Posts.deletePost(id);
  return new Response(null, {
    status: 303,
    headers: { Location: "/admin/posts" },
  });
}
