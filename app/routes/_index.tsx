import { deleteItem, readItems, updateItem } from "@directus/sdk";
import {
  createCookie,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Form, json, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Navbar from "~/components/Navbar";
import TodoList from "~/components/TodoList";
import directus from "~/lib/directus";
import { getUserIdFromRequest, Todo } from "~/utils/helpers/helper";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserIdFromRequest(request);
  const accessToken = request.headers.get("Cookie");
  if (!accessToken) return null;

  const accessTokenCookie = await createCookie("access_token").parse(
    accessToken
  );
  // console.log(accessTokenCookie)

  // console.log(userId)

  directus.setToken(accessTokenCookie);

  const todos = await directus.request(
    readItems("todos", {
      filter: {
        user_id: {
          _eq: userId,
        },
      },
    })
  );
  return { todos, userId };
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const intent = formData.get("intent");

  try {
    if (intent === "delete" && id) {
      await directus.request(deleteItem("todos", id.toString()));
      return json({ success: true });
    } else if (intent === "updateStatus" && id) {
      const status = formData.get("status");
      await directus.request(updateItem("todos", id.toString(), { status }));
      return json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
  return json({ success: false });
};

export default function Index() {
  const { todos, userId } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [search, setSearch] = useState("");

  const filteredTodos = todos.filter((todo: Todo) => {
    const matchesSearch =
      search.toLowerCase() === ""
        ? true
        : todo.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? todo.status === "completed"
        : todo.status === "pending";
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-blue-100 rounded-md m-8 border">
        <div className="flex justify-center m-4">
          <input
            type="text"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md ${
              filter === "completed" ? "bg-blue-600" : "bg-gray-500"
            } text-white hover:bg-blue-600`}
          >
            Show Extra Completed
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md ${
              filter === "pending" ? "bg-blue-600" : "bg-gray-500"
            } text-white hover:bg-blue-600`}
          >
            Show Pending
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filter === "all" ? "bg-blue-600" : "bg-gray-500"
            } text-white hover:bg-blue-600`}
          >
            Show All
          </button>
          <Link
            className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            to="/create"
          >
            Create a new Todo
          </Link>
        </div>
        <div>
          <TodoList todos={filteredTodos} />
        </div>
      </div>
    </>
  );
}
