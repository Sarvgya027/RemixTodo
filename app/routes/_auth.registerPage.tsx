import { createUser, registerUser } from "@directus/sdk";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import RegisterForm from "~/components/Register";
import directus from "~/lib/directus";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!fullName || !email || !password || !confirmPassword) {
    return json({ error: "All fields are required" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ error: "Invalid email format" }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match" }, { status: 400 });
  }

  try {
    const user = { email, password }
    const registeredUser = await directus.request(createUser(user));
    console.log("Registered user:", registeredUser);

    if (registeredUser && registeredUser.id) {
      return redirect('/loginPage')
    }

  } catch (error) {
    console.error("Registration error:", error);
    return json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
};


export default function Register() {
  const actionData = useActionData();

  return (
    <>
      <RegisterForm />

    </>
  );
}