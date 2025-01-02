import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, addTodo, deleteTodo } from "../api/todos";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";

export default function TodoList() {
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onMutate: async (title) => {
      await queryClient.cancelQueries(["todos"]);
      const previousTodos = queryClient.getQueryData(["todos"]);
  
      const optimisticTodo = {
        id: Math.random(), // 임시 ID
        title,
        completed: false,
      };
  
      queryClient.setQueryData(["todos"], (old) => [...old, optimisticTodo]);
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
    },
    onSettled: () => {
    },
  });
  
  

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries(["todos"]);
      const previousTodos = queryClient.getQueryData(["todos"]);
  
      queryClient.setQueryData(["todos"], (old) =>
        old.filter((t) => t.id !== id)
      );
  
      return { previousTodos };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
    },
    onSettled: () => {
    },
  });
  
  

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생 😥</p>;

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">🧠 React Query Todo List</h1>

      <AddTodoForm onAdd={(title) => addMutation.mutate(title)} />

      <ul className="mt-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        ))}
      </ul>
    </div>
  );
}