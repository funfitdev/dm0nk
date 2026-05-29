import { renderComponent } from "ssx/jsx-runtime";

export async function render(template: JSX.Component) {
  const html = await renderComponent(template);
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
