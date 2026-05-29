import { render } from "@/utils/render.tsx";
import { getTheme } from "@/utils/cookie.tsx";
import { findByUsername, verifyPassword } from "@/db/users.ts";
import { createSession, deleteSession } from "@/db/sessions.ts";
import { parseCookie } from "@/utils/cookie.tsx";
import * as AuthView from "@/views/auth-view.tsx";

export async function loginPage(req: Request) {
  const theme = getTheme(req);
  return render(<AuthView.Login theme={theme} />);
}

export async function login(req: Request) {
  const theme = getTheme(req);
  const form = await req.formData();
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  if (!username || !password) {
    return render(
      <AuthView.Login
        theme={theme}
        error="Username and password are required."
      />,
    );
  }

  const user = findByUsername(username);
  if (!user || !verifyPassword(user, password)) {
    return render(
      <AuthView.Login theme={theme} error="Invalid username or password." />,
    );
  }

  const session = createSession(user.id);
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin/posts",
      "Set-Cookie": `session=${session.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    },
  });
}

export async function logout(req: Request) {
  const cookies = parseCookie(req.headers.get("Cookie") || "");
  if (cookies.session) {
    deleteSession(cookies.session);
  }
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/login",
      "Set-Cookie": "session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    },
  });
}
