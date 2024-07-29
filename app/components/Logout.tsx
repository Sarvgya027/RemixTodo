import { Form } from "@remix-run/react"

export default function Logout() {
  return (
    <Form method="post" action="/logoutPage" className="inline-block">
      <input type="hidden" name="intent" value="logout" />
      <button type="submit" className="px-4 py-2 bg-transparent border text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors duration-200">
        Logout
      </button>
    </Form>
  )
}