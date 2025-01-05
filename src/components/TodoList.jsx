import React from "react";
import { useTodos } from "../hooks/useTodos";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";

export default function TodoList() {
  const { todos, addTodo, deleteTodo } = useTodos();

  return (
    <div className="todo-container">
      <h1 className="todo-header text-3xl font-bold">📝 My Todo List</h1>
      <AddTodoForm onAdd={addTodo} />
      <ul className="todo-list mt-4 rounded-lg overflow-hidden shadow-sm">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
        ))}
      </ul>
    </div>
  );
}
