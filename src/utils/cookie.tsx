export function parseCookie(header: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const part of header.split(";")) {
    const [key, ...rest] = part.split("=");
    const k = key?.trim();
    if (k) cookies[k] = rest.join("=").trim();
  }
  return cookies;
}

export function getTheme(req: Request): "light" | "dark" {
  const cookies = parseCookie(req.headers.get("Cookie") || "");
  return cookies.theme === "dark" ? "dark" : "light";
}
