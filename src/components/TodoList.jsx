import React from "react";
import { useTodos } from "../hooks/useTodos";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";

export default function TodoList() {
  const { todos, addTodo, deleteTodo } = useTodos();

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">🧠 React Query Todo List</h1>

      <AddTodoForm onAdd={addTodo} />

      <ul className="mt-4">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
        ))}
      </ul>
    </div>
  );
}
