import React from 'react';
import { Link } from "@remix-run/react";
import { Todo } from "~/utils/helpers/helper";

interface TodoListProps {
  todos: Todo[];
  handleDelete: (id: number) => void;
  handleToggle: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, handleDelete, handleToggle }) => {
  return (
    <ul className="space-y-2 mt-8">
      {todos.map((todo, idx) => (
        <li
          key={idx}
          className="bg-white p-2 flex justify-between rounded-md shadow transition-all duration-300 hover:shadow-md border-l-4 border-indigo-500"
        >
          <div>
            <h2 className={`text-xl font-semibold mb-2 text-slate-700 ${todo.isCompleted ? 'line-through' : ''}`}>{todo.title}</h2>
            <p className="text-slate-500">{todo.description}</p>
            <p className="text-slate-500 text-sm mt-2">Due date: {todo.dueDate}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => handleToggle(todo.id)} className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600">{todo.isCompleted ? 'Not Complete' : 'Complete'}</button>
            <Link to={`/edit/${todo.id}`} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Edit</Link>
            <button onClick={() => handleDelete(todo.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
