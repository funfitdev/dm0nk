import { parseCookie } from "@/utils/cookie.tsx";
import { findSession } from "@/db/sessions.ts";
import { findById, type User } from "@/db/users.ts";

export async function getSessionUser(req: Request): Promise<User | null> {
  const cookies = parseCookie(req.headers.get("Cookie") || "");
  const sessionId = cookies.session;
  if (!sessionId) return null;
  const session = await findSession(sessionId);
  if (!session) return null;
  return findById(session.user_id);
}

export async function requireAuth(req: Request): Promise<User | Response> {
  const user = await getSessionUser(req);
  if (!user) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login" },
    });
  }
  return user;
}
