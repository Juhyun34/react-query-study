import React from "react";

export default function TodoItem({ todo, onDelete, onToggle, isDeleting, isToggling }) {
  return (
    <li className={todo.completed ? "completed" : ""}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        disabled={isToggling}
        className="todo-checkbox"
      />
      <span className={todo.completed ? "completed-text" : ""}>
        {todo.title}
      </span>
      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        disabled={isDeleting}
      >
        {isDeleting ? "..." : "Delete"}
      </button>
    </li>
  );
}
