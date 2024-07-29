import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { logout } from "@directus/sdk";
import directus from "~/lib/directus";
import { clearUserIdCookie, getUserIdFromRequest } from "~/utils/helpers/helper";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return redirect("/loginPage");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserIdFromRequest(request);
  if (userId) {
    await directus.request(logout());
    return redirect("/loginPge", {
      headers: {
        "Set-Cookie": await clearUserIdCookie(),
      },
    });
  }
  return redirect("/loginPage");
};

export default function Logout() {
  return null;
}
