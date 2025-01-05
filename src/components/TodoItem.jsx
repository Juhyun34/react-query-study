import React from "react";

export default function TodoItem({ todo, onDelete }) {
  return (
    <li>
      <span>{todo.title}</span>
      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}
