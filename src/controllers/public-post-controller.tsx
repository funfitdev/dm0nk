import { render } from "@/utils/render.tsx";
import { getTheme } from "@/utils/cookie.tsx";
import * as Posts from "@/db/posts.ts";
import * as PublicPostView from "@/views/public-post-view.tsx";

// GET /posts/:slug — show a published post
export async function show(req: Request) {
  const theme = getTheme(req);
  const url = new URL(req.url);
  const slug = url.pathname.split("/")[2];
  const post = await Posts.findBySlug(slug);

  if (!post || !post.published) {
    return new Response("Not found", { status: 404 });
  }

  const meta = await Posts.getMeta(post.id);
  return render(<PublicPostView.Show post={post} meta={meta} theme={theme} />);
}
