import React, { useState } from "react";

export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("할 일을 입력하세요!");
    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="새 할 일 입력..."
        className="flex-1 border p-2 rounded-lg"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
      >
        추가
      </button>
    </form>
  );
}
