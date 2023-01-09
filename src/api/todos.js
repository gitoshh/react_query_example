import axios from "axios";

const todosApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export const getTodos = async () => {
  const result = await todosApi.get("/todos");

  return result.data;
};

export const addTodo = async (todo) => {
  return await todosApi.post("/todos", todo);
};

export const updateTodo = async (todo) => {
  return await todosApi.patch(`/todos/${todo.id}`, todo);
};

export const deleteTodo = async ({ id }) => {
  return await todosApi.delete(`/todos/${id}`);
};
