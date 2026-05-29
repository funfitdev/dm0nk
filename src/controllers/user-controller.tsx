import * as UserView from "@/views/user-view.tsx";
import { render } from "@/utils/render.tsx";

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "Alice" },
  { id: 5, name: "Bob" },
  { id: 6, name: "Charlie" },
  { id: 7, name: "Alice" },
  { id: 8, name: "Bob" },
  { id: 9, name: "Charlie" },
  { id: 10, name: "Alice" },
  { id: 11, name: "Bob" },
  { id: 12, name: "Charlie" },
];

export async function index() {
  return render(<UserView.Index users={users} />);
}
