import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import TodoList from "~/components/TodoList";
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
        <TodoList todos={filteredTodos} handleDelete={handleDelete} handleToggle={handleToggle} />
      </div>
    </div>
  )
}
