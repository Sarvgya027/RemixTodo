import { readItem, updateItem } from "@directus/sdk";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirect, useFetcher, useLoaderData } from "@remix-run/react";
import directus from "~/lib/directus";
import { getUserIdFromRequest } from "~/utils/helpers/helper";



export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = await getUserIdFromRequest(request)
  const id = params.id
  // console.log(id)
  
  if (typeof id === 'string') {
    try {
      const todo = await directus.request(readItem('todos', id))

      if (todo.user_id !== userId) {
        return json({ error: "You do not have permission to edit this." }, { status: 403 });
      }

      // console.log(todo)
      return json({ todo })
    } catch (error) {
      console.log('error in update', error)
    }
  }

}

export const action: ActionFunction = async ({ request }) => {
  const userId = getUserIdFromRequest(request)
  const formData = await request.formData();
  const id = formData.get('id');


  if (typeof id === 'string') {
    const updatedTodo = {
      id,
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status'),
      dueDate: formData.get('dueDate')
    }
    try {
      await directus.request(updateItem('todos', id, updatedTodo));
      return redirect('/')
    } catch (error) {
      console.log('Error updating todo:', error);
    }
  }
}


export default function Edit() {
  const { todo } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className=" mx-auto flex flex-col items-center justify-center my-10 ">
      <h1 className="text-3xl text-blue-400 pb-10  font-semibold ">Edit To-Do Task</h1>
      <fetcher.Form method="post" >
        <div className="flex flex-col w-full gap-y-4  rounded-md p-12 bg-blue-50">
          <label htmlFor="title" className="text-zinc-700 text-2xl font-semibold min-w-[300px]">Title</label>
          <input className="border-zinc-400 rounded-md py-2 px-2  border" placeholder="Enter your title..." type="text" name="title" id="title" defaultValue={todo.title} required />

          <label htmlFor="description" className="text-zinc-700 text-2xl font-semibold min-w-[300px] mt-4">Description</label>
          <input className="border-zinc-400 rounded-md py-2 px-2  border" placeholder="Enter your description..." type="text" name="description" id="description" defaultValue={todo?.description} required />

          <label htmlFor="dueDate" className="text-zinc-700 text-2xl font-semibold min-w-[300px] mt-4">Due date</label>
          <input className="border-zinc-400 rounded-md py-2 px-2  border" type="datetime-local" name="dueDate" id="dueDate" defaultValue={todo.dueDate} required />

          <input type="hidden" name="isCompleted" defaultValue={todo.status} />
          <input type="hidden" name="id" defaultValue={todo.id} />
          <input type="hidden" name="createdAt" defaultValue={todo.date_created} />

          <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded-md mt-8 hover:bg-blue-600">Update</button>
        </div>
      </fetcher.Form>
    </div>
  );

}