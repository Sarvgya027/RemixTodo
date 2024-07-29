import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { login, readMe } from "@directus/sdk";
import directus from "~/lib/directus";
import { client, setUserIdCookie } from "~/utils/helpers/helper";
import Login from "~/components/Login";


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const loginResponse = await directus.request(login(email, password));
    if (!loginResponse || !loginResponse.access_token) {
      return json({ error: "Login failed. Please check your credentials." }, { status: 401 });
    }
    const userDetails = await client.request(readMe());
    const userId = userDetails.id;
    
    //cookie helper function
    const cookie = await setUserIdCookie(userId);

    return redirect('/', {
      headers: {
        'Set-Cookie': cookie
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return json({ error: "Login failed. Please try again." }, { status: 500 });
  }
};

export default function LoginPage() {

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-green-600">
        <div className="relative top-0 text-white bg-transparent p-8">
          <h1 className="text-3xl">Please login to access your todos</h1>
        </div>
        <Login />

      </div>

    </div>
  );
}
