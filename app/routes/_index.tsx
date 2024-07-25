import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Todo, getTodosFromLocalStorage } from "~/utils/helpers/helper";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const todos = getTodosFromLocalStorage(); //helper function
    setTodos(todos)
  }, [])

//delete function for todo
  const handleDelete = (id: number) => {
    try {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  
//toggle function for completed tasks
  const handleToggle = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    )
    setTodos(updatedTodos)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  //filter function && show isCompleted or pending based on ternary
  const filteredTodos = todos.filter((todo) => (
    (search.toLowerCase() === '' ? true : todo.title.toLowerCase().includes(search)) &&
    (filter === 'all' ? true : (filter === 'completed' ? todo.isCompleted : !todo.isCompleted))
  ))

  return (
    <div className="max-w-2xl mx-auto p-6 bg-blue-100 rounded-md m-8 border">
      <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">Todo-ist</h1>
      <div className="flex justify-center m-4 ">
        <input type="text" name="search" onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="border border-gray-300 rounded-md px-4 py-2 w-full" id="" />
      </div>
      <div className="flex justify-between">
        <button onClick={() => setFilter('completed')} className=" bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Show Completed</button>
        <button onClick={() => setFilter('pending')} className=" bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Show Pending</button>
        <button onClick={() => setFilter('all')} className=" bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Show All</button>
        <Link className=" bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600" to='/create'>Create a new Todo</Link>
      </div>

      <div>
        <ul className="space-y-2 mt-8">
          {filteredTodos.map((todo, idx) => (
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
      </div>
    </div>
  )
}
