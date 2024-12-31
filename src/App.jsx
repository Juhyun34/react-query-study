import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTodos = async () => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=10");
  return res.data;
};

export default function App() {
  const { data, isLoading, isError, error } = useQuery(["todos"], fetchTodos);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러: {error.message}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>React Query 연습</h1>
      <ul>
        {data.map((t) => (
          <li key={t.id}>
            <input type="checkbox" checked={t.completed} readOnly /> {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
