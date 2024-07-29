import { ActionFunction, createCookie, LoaderFunction, redirect } from "@remix-run/node";
import { logout } from "@directus/sdk";
import { clearUserIdCookie, client, getUserIdFromRequest } from "~/utils/helpers/helper";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return redirect("/loginPage");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");

  const refreshToken = await createCookie('refresh_token').parse(cookieHeader);

  if (refreshToken) {
    try {
      await client.request(logout(refreshToken));
    } catch (error) {
      // console.error("Error during logout:", error);
    }
  }

  const clearUserIdCookieValue = await clearUserIdCookie();
  const clearAccessTokenCookieValue = await createCookie('access_token', { maxAge: 0 }).serialize('');
  const clearRefreshTokenCookieValue = await createCookie('refresh_token', { maxAge: 0 }).serialize('');

  return redirect("/loginPage", {
    headers: {
      "Set-Cookie": `${clearUserIdCookieValue}, ${clearAccessTokenCookieValue}, ${clearRefreshTokenCookieValue}`
    },
  });
};

export default function Logout() {
  return null;
};
