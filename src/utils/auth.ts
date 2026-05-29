import { parseCookie } from "@/utils/cookie.tsx";
import { findSession } from "@/db/sessions.ts";
import { findById, type User } from "@/db/users.ts";

export function getSessionUser(req: Request): User | null {
  const cookies = parseCookie(req.headers.get("Cookie") || "");
  const sessionId = cookies.session;
  if (!sessionId) return null;
  const session = findSession(sessionId);
  if (!session) return null;
  return findById(session.user_id);
}

export function requireAuth(req: Request): User | Response {
  const user = getSessionUser(req);
  if (!user) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login" },
    });
  }
  return user;
}
