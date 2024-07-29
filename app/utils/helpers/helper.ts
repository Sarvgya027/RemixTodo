import { authentication, createDirectus, rest } from "@directus/sdk";

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: string;
  date_created: string;
  dueDate: string;
}

export const getTodosFromLocalStorage = (): Todo[] => {
  try {
    const todos = localStorage.getItem('todos')
    return todos ? JSON.parse(todos) : [];
  } catch (error) {
    console.log('Error from localstorage', error)
    return []
  }
}






//for authentication ( auth composable )
export const client = createDirectus(process.env.DIRECTUS_URL || '').with(authentication()).with(rest());







// userId stored in http only cookie
import { createCookie } from "@remix-run/node";

// Helper function to set the user ID cookie
export const setUserIdCookie = async (userId: string) => {
  const userCookie = createCookie('user_id', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30
  });

  return await userCookie.serialize(userId);
};

// Helper function to get the user ID from the request
export const getUserIdFromRequest = async (request: Request) => {
  const userCookie = createCookie('user_id', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30
  });

  const cookieHeader = request.headers.get("Cookie");
  if (cookieHeader) {
    const cookies = await userCookie.parse(cookieHeader);
    return cookies.user_id; 
  }
  return null;
};
