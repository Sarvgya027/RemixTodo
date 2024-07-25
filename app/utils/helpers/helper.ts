export interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
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