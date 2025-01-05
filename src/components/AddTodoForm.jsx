import React, { useState } from "react";

export default function AddTodoForm({ onAdd, isAdding }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a task!");
    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        disabled={isAdding}
      />
      <button type="submit" disabled={isAdding}>
        {isAdding ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
