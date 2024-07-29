import { authentication, createDirectus, rest } from "@directus/sdk";

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: string;
  date_created: string;
  dueDate: string;
}

//for authentication ( auth composable )
export const client = createDirectus(process.env.DIRECTUS_URL || '').with(authentication()).with(rest());


// userId stored in http only cookie
import { createCookie } from "@remix-run/node";

// Set the user ID cookie
export const setUserIdCookie = async (userId: string) => {
  const userCookie = createCookie('user_id', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });

  return await userCookie.serialize(userId);
};

// Get the user ID from the request cookies
export const getUserIdFromRequest = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const userCookie = await createCookie('user_id').parse(cookieHeader);
  return userCookie || null;
};

// Clear the user ID cookie
export const clearUserIdCookie = async () => {
  const userCookie = createCookie('user_id', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return await userCookie.serialize('', {
    maxAge: 0,
  });
};
