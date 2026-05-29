import { routes } from "./src/routes.tsx";

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  reusePort: true,
  routes,
  fetch(req) {
    return new Response("Hello World");
  },
});

console.log(`Server running at http://localhost:${server.port}`);
