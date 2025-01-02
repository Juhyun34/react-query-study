// src/api/todos.js
import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com/todos";

export const fetchTodos = async () => {
  const { data } = await axios.get(`${BASE_URL}?_limit=10`);
  return data;
};

export const addTodo = async (newTodo) => {
  const { data } = await axios.post(BASE_URL, newTodo);
  return data;
};

export const deleteTodo = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
};
