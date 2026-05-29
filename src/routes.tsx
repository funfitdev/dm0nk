import { join } from "path";
import * as Users from "@/controllers/user-controller.tsx";
import * as AdminUsers from "@/controllers/admin/user-controller.tsx";
import * as Auth from "@/controllers/auth-controller.tsx";
import * as AdminPosts from "@/controllers/post-controller.tsx";
import * as PublicPosts from "@/controllers/public-post-controller.tsx";
import { parseCookie } from "@/utils/cookie.tsx";

export const routes = {
  // Auth
  "/login": {
    GET: Auth.loginPage,
    POST: Auth.login,
  },
  "/logout": { POST: Auth.logout },

  // Public posts
  "/posts/:slug": PublicPosts.show,

  // Admin posts
  "/admin/posts": {
    GET: AdminPosts.index,
    POST: AdminPosts.create,
  },
  "/admin/posts/new": AdminPosts.new_,
  "/admin/posts/:id/edit": AdminPosts.edit,
  "/admin/posts/:id": {
    POST: async (req: Request) => {
      // Method override: forms can't send PUT, so POST with _method=PUT
      return AdminPosts.update(req);
    },
    DELETE: AdminPosts.delete_,
  },
  "/admin/posts/:id/delete": {
    POST: AdminPosts.delete_,
  },

  // Admin users (existing)
  "/users": Users.index,
  "/admin/users": {
    GET: AdminUsers.index,
    POST: AdminUsers.create,
  },
  "/admin/users/new": AdminUsers.new_,
  "/admin/users/:id": {
    GET: AdminUsers.show,
    PUT: AdminUsers.update,
    DELETE: AdminUsers.delete_,
  },
  "/admin/users/:id/edit": AdminUsers.edit,
  "/theme": {
    POST: (req: Request) => {
      const cookies = parseCookie(req.headers.get("Cookie") || "");
      const current = cookies.theme;
      const next = current === "dark" ? "light" : "dark";
      const referer = req.headers.get("Referer") || "/admin/posts";
      return new Response(null, {
        status: 303,
        headers: {
          Location: referer,
          "Set-Cookie": `theme=${next}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`,
        },
      });
    },
  },
  "/styles.css": () => {
    const file = Bun.file(join(import.meta.dir, "..", "dist", "styles.css"));
    return new Response(file, {
      headers: { "Content-Type": "text/css" },
    });
  },
  "/client.js": () => {
    const file = Bun.file(join(import.meta.dir, "..", "dist", "client.js"));
    return new Response(file, {
      headers: { "Content-Type": "application/javascript" },
    });
  },
} as const;
