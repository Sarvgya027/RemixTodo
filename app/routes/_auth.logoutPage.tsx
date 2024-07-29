import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { logout } from "@directus/sdk";
import directus from "~/lib/directus";

export const loader: LoaderFunction = async () => {
  return redirect("/loginPage");
};

export const action: ActionFunction = async () => {
  await directus.request(logout());
  return redirect("/loginPage");
};
