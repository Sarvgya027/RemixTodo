import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useAsyncError, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Todo, getTodosFromLocalStorage } from "~/utils/helpers/helper";


export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id
  // console.log(id)
  return json({ id })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const updatedTodo = {
    id: Number(formData.get('id')),
    title: formData.get('title'),
    description: formData.get('description'),
    isCompleted: formData.get('isCompleted'),
    createdAt: formData.get('createdAt'),
    dueDate: formData.get('dueDate')
  }
  return json({ updatedTodo })
}

export default function Edit() {
  const { id } = useLoaderData<typeof loader>();
  const actionFormData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null)

  //effect for getting todos and setting to state
  useEffect(() => {
    const todos = getTodosFromLocalStorage();
    const currentTodo = todos.find((todo: Todo) => todo.id === Number(id)) || null;
    // console.log(currentTodo)
    setTodo(currentTodo)

  }, [id])

  //effect for finding and updating existing todo
  useEffect(() => {
    if (actionFormData?.updatedTodo) {
      // const todos = JSON.parse(localStorage.getItem('todos') || '[]')
      const todos = getTodosFromLocalStorage();
      const updatedTodos = todos.map((todo: Todo) => todo.id === actionFormData.updatedTodo.id ? actionFormData.updatedTodo : todo)
      localStorage.setItem('todos', JSON.stringify(updatedTodos))
      navigate('/')
    }
  }, [actionFormData, navigate])

  return (
    <div className=" mx-auto flex flex-col items-center justify-center my-10 ">
      <h1 className="text-3xl text-blue-400 pb-10  font-semibold ">Edit To-Do Task</h1>
      <Form method="post" >
        <div className="flex flex-col w-full gap-y-4  rounded-md p-12 bg-blue-50">
          <label htmlFor="title" className="text-zinc-700 text-2xl font-semibold min-w-[300px]">Title</label>
          <input className="border-zinc-400 rounded-md py-2 px-2  border" placeholder="Enter your title..." type="text" name="title" id="title" defaultValue={todo?.title} required />

          <label htmlFor="description" className="text-zinc-700 text-2xl font-semibold min-w-[300px] mt-4">Description</label>
          <input className="border-zinc-400 rounded-md py-2 px-2  border" placeholder="Enter your description..." type="text" name="description" id="description" defaultValue={todo?.description} required />

          <label htmlFor="dueDate" className="text-zinc-700 text-2xl font-semibold min-w-[300px] mt-4">Due date</label>
          <input className="border-zinc-400 rounded-md py-2 px-2  border" type="datetime-local" name="dueDate" id="dueDate" defaultValue={todo?.dueDate} required />

          <input type="hidden" name="isCompleted" defaultValue={String(todo?.isCompleted)} />
          <input type="hidden" name="id" defaultValue={todo?.id} />
          <input type="hidden" name="createdAt" defaultValue={todo?.createdAt} />

          <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded-md mt-8 hover:bg-blue-600">Update</button>
        </div>
      </Form>
    </div>
  );

}