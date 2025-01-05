import React, { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { useFilteredTodos } from "../hooks/useFilteredTodos";
import { useTodoStats } from "../hooks/useTodoStats";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";

export default function TodoList() {
  const [filter, setFilter] = useState("all"); // all, active, completed
  const {
    addTodo,
    deleteTodo,
    toggleTodo,
    isLoading,
    isError,
    error,
    refetch,
    isAdding,
    isDeleting,
    isToggling,
  } = useTodos();
  const { todos } = useFilteredTodos(filter);
  const { stats } = useTodoStats();

  if (isLoading) {
    return (
      <div className="todo-container">
        <div className="loading">Loading todos...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="todo-container">
        <div className="error">
          <p>Error: {error?.message || "Failed to load todos"}</p>
          <button onClick={() => refetch()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <h1 className="todo-header text-3xl font-bold">📝 My Todo List</h1>
      
      {/* 통계 표시 */}
      <div className="todo-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value">{stats.active}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
      </div>

      {/* 필터 버튼 */}
      <div className="filter-buttons">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <AddTodoForm onAdd={addTodo} isAdding={isAdding} />
      
      {isAdding && <div className="loading-indicator">Adding todo...</div>}
      
      <ul className="todo-list mt-4 rounded-lg overflow-hidden shadow-sm">
        {todos.length === 0 ? (
          <li className="empty-state">No todos found</li>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
              isDeleting={isDeleting}
              isToggling={isToggling}
            />
          ))
        )}
      </ul>
    </div>
  );
}
