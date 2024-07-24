import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

let Id = Math.ceil(Math.random() * 999999)
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  // console.log(formData)

  const newTodo = {
    id: Date.now(),
    title: formData.get("title"),
    description: formData.get("description"),
    isCompleted: false,
    createdAt: new Date().toLocaleString(),
    dueDate: formData.get('dueDate')
  }
  // console.log(newTodo)
  // return redirect('/')

  return json({ newTodo })

}

export default function Create() {
  const actionFormdata = useActionData<typeof action>();
  const navigate = useNavigate();
  // console.log(actionFormdata?.newTodo)

  useEffect(() => {
    if (actionFormdata?.newTodo) {
      const todos = JSON.parse(localStorage.getItem('todos') || '[]')
      todos.push(actionFormdata.newTodo)
      localStorage.setItem('todos', JSON.stringify(todos))
      navigate('/') 
    }
  }, [actionFormdata])


  return (
    <div className=" mx-auto flex flex-col items-center justify-center my-10 ">
      <h1 className="text-3xl text-blue-400 pb-10  font-semibold ">Create a To-Do Task</h1>
      <Form method="post" >
        <div className="flex flex-col w-full gap-y-4  rounded-md p-12 bg-blue-50" >
          <label
            htmlFor="title"
            className="text-zinc-700 text-2xl font-semibold min-w-[300px]"
          >Title</label>
          <input
            className="border-zinc-400 rounded-md py-2 px-2  border"
            placeholder="Enter your title..."
            type="text"
            name="title"
            id="title"
            required />

          <label
            htmlFor="description"
            className="text-zinc-700 text-2xl font-semibold min-w-[300px] mt-4">Description</label>
          <input
            className="border-zinc-400 rounded-md py-2 px-2  border"
            placeholder="Enter your description..."
            type="text"
            name="description"
            id="description"
            required />

          <label
            htmlFor="dueDate"
            className="text-zinc-700 text-2xl font-semibold min-w-[300px] mt-4">Due date</label>
          <input
            className="border-zinc-400 rounded-md py-2 px-2  border"
            placeholder="Enter due date..."
            type="datetime-local"
            name="dueDate"
            id="dueDate"
            defaultValue={(new Date()).toTimeString()}
            min={(new Date()).toTimeString()}
            required
          />

          <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded-md mt-8 hover:bg-blue-600 ">Create</button>
        </div>
      </Form>

    </div>  
  )
}