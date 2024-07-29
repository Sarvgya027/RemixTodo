import React from 'react';
import { Form, Link, useFetcher } from "@remix-run/react";
import { Todo } from "~/utils/helpers/helper";

interface TodoListProps {
  todos: Todo[];
  // handleToggle: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const fetcher = useFetcher();
  return (
    <ul className="space-y-2 mt-8">
      {todos.map((todo, idx) => (
        <li
          key={idx}
          className="bg-white p-2 flex justify-between rounded-md shadow transition-all duration-300 hover:shadow-md border-l-4 border-indigo-500"
        >
          <div>
            <h2 className={`text-xl font-semibold mb-2 text-slate-700 ${todo.status === 'completed' ? 'line-through' : ''}`}>{todo.title}</h2>
            <p className="text-slate-500">{todo.description}</p>
            <p className="text-slate-500 text-sm mt-2">Due date: {todo.dueDate}</p>
          </div>
          <div className="flex gap-2 items-center">
            <fetcher.Form method='post'>
              <input type='hidden' name='id' value={todo.id} />
              <input type="hidden" name="intent" value='updateStatus' />
              <select
                name="status"
                defaultValue={todo.status}
                onChange={(e) => fetcher.submit(e.target.form)}
                className={`px-3 py-2 rounded-md ${
                  todo.status === 'completed' ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </fetcher.Form>
            <Link to={`/edit/${todo.id}`} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Edit</Link>
            <fetcher.Form method='post'>
              <input type='hidden' name='id' value={todo.id} />
              <input type="hidden" name="intent" value='delete' />
              <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete</button>
            </fetcher.Form>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
