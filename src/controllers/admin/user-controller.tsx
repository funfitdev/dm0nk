import * as UserView from "@/views/admin/user-view.tsx";
import { render } from "@/utils/render.tsx";
import { getTheme } from "@/utils/cookie.tsx";

type User = { id: number; name: string; email: string; role: "Admin" | "User" };

const allUsers: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "User" },
];

let nextId = 4;

function getFilteredUsers(search?: string) {
  return search
    ? allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : allUsers;
}

function findUser(id: string) {
  return allUsers.find((u) => u.id === Number(id));
}

// GET /admin/users — list all users
export async function index(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || undefined;
  const sheet = url.searchParams.get("sheet") || undefined;
  const sheetId = url.searchParams.get("id") || undefined;
  const isHtmx = req.headers.get("HX-Request") === "true";
  const users = getFilteredUsers(search);
  const theme = getTheme(req);

  if (isHtmx) {
    return render(<UserView.List users={users} />);
  }

  // Resolve sheet / confirm state for full-page render
  let sheetContent: JSX.Children | undefined;
  let confirmState: { name: string; url: string } | undefined;

  if (sheet === "show" && sheetId) {
    const user = findUser(sheetId);
    if (user) sheetContent = <UserView.Show user={user} />;
  } else if (sheet === "edit" && sheetId) {
    const user = findUser(sheetId);
    if (user) sheetContent = <UserView.Edit user={user} />;
  } else if (sheet === "new") {
    sheetContent = <UserView.New />;
  } else if (sheet === "delete" && sheetId) {
    const user = findUser(sheetId);
    if (user) {
      sheetContent = <UserView.Show user={user} />;
      confirmState = { name: user.name, url: `/admin/users/${user.id}` };
    }
  }

  return render(
    <UserView.Index
      users={users}
      search={search}
      sheetContent={sheetContent}
      confirmState={confirmState}
      theme={theme}
    />,
  );
}

// GET /admin/users/:id — show a single user
export async function show(req: Request & { params: { id: string } }) {
  const user = findUser(req.params.id);
  if (!user) return new Response("Not Found", { status: 404 });
  return render(<UserView.Show user={user} />);
}

// GET /admin/users/new — render create form
export async function new_(req: Request) {
  return render(<UserView.New />);
}

// POST /admin/users — handle create form submission
export async function create(req: Request) {
  const formData = await req.formData();
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const role = (formData.get("role") as "Admin" | "User") ?? "User";

  if (!name || !email) {
    const response = await render(
      <UserView.New errorMessage="Name and email are required." />,
    );
    return response;
  }

  const user: User = { id: nextId++, name, email, role };
  allUsers.push(user);
  console.log(`Created user ${user.id}: ${user.name}`);

  const response = await render(
    <UserView.Show
      user={user}
      successMessage={`User "${user.name}" created successfully.`}
    />,
  );
  response.headers.set(
    "HX-Trigger",
    JSON.stringify({
      refreshTable: true,
      setSheetState: { sheet: "show", id: String(user.id) },
    }),
  );
  return response;
}

// GET /admin/users/:id/edit — render edit form
export async function edit(req: Request & { params: { id: string } }) {
  const user = findUser(req.params.id);
  if (!user) return new Response("Not Found", { status: 404 });
  return render(<UserView.Edit user={user} />);
}

// PUT /admin/users/:id — handle edit form submission
export async function update(req: Request & { params: { id: string } }) {
  const user = findUser(req.params.id);
  if (!user) return new Response("Not Found", { status: 404 });

  const formData = await req.formData();
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const role = (formData.get("role") as "Admin" | "User") ?? user.role;

  if (!name || !email) {
    const response = await render(
      <UserView.Edit user={user} errorMessage="Name and email are required." />,
    );
    return response;
  }

  user.name = name;
  user.email = email;
  user.role = role;
  console.log(`Updated user ${user.id}: ${user.name}`);

  const response = await render(
    <UserView.Show
      user={user}
      successMessage={`User "${user.name}" updated successfully.`}
    />,
  );
  response.headers.set(
    "HX-Trigger",
    JSON.stringify({
      refreshTable: true,
      setSheetState: { sheet: "show", id: String(user.id) },
    }),
  );
  return response;
}

// DELETE /admin/users/:id — delete a user
export async function delete_(req: Request & { params: { id: string } }) {
  const idx = allUsers.findIndex((u) => u.id === Number(req.params.id));
  if (idx === -1) return new Response("Not Found", { status: 404 });

  const [removed] = allUsers.splice(idx, 1);
  console.log(`Deleted user ${removed!.id}: ${removed!.name}`);

  const currentUrl = req.headers.get("HX-Current-URL");
  const search = currentUrl
    ? new URL(currentUrl).searchParams.get("search") || undefined
    : undefined;
  const users = getFilteredUsers(search);

  return render(<UserView.List users={users} />);
}
