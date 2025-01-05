import React from "react";

export default function TodoItem({ todo, onDelete }) {
  return (
    <li className="flex justify-between items-center border-b py-2">
      <span>{todo.title}</span>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 transition"
      >
        삭제
      </button>
    </li>
  );
}
