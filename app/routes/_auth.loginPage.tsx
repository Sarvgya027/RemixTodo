

import { ActionFunctionArgs, createCookie, json, redirect } from "@remix-run/node";
import Login from "~/components/Login";
import { setUserIdCookie } from "~/utils/helpers/helper";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password") as string;

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const loginResponse = await fetch(`${process.env.DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      return json({ error: "Login failed. Please check your credentials." }, { status: 401 });
    }

    const { data } = await loginResponse.json();
    const { access_token, refresh_token } = data;

    const userResponse = await fetch(`${process.env.DIRECTUS_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (!userResponse.ok) {
      return json({ error: "Fetching user details failed." }, { status: 401 });
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    const accessTokenCookie = createCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    const refreshTokenCookie = createCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    const accessTokenCookieValue = await accessTokenCookie.serialize(access_token);
    const refreshTokenCookieValue = await refreshTokenCookie.serialize(refresh_token);
    const userIdCookieValue = await setUserIdCookie(userId);

    return redirect(`/`, {
      headers: {
        'Set-Cookie': `${accessTokenCookieValue}, ${refreshTokenCookieValue}, ${userIdCookieValue}`
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return json({ error: "Login failed. Please try again." }, { status: 500 });
  }
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-green-600">
      <div className="relative top-0 text-white bg-transparent p-8">
        <h1 className="text-3xl">Please login to access your todos</h1>
      </div>
      <Login />
    </div>
  );
}
