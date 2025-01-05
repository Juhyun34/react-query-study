import { useQuery } from "@tanstack/react-query";
import { useTodos } from "./useTodos";

export function useFilteredTodos(filter = "all") {
  const { todos, isLoading, isError, error } = useTodos();

  // 필터링된 데이터를 별도 쿼리 키로 관리
  const { data: filteredTodos } = useQuery({
    queryKey: ["todos", filter],
    queryFn: () => {
      if (filter === "active") {
        return todos.filter((todo) => !todo.completed);
      }
      if (filter === "completed") {
        return todos.filter((todo) => todo.completed);
      }
      return todos;
    },
    enabled: !!todos, // todos가 있을 때만 실행
    staleTime: 1000 * 60 * 5,
  });

  return {
    todos: filteredTodos || [],
    isLoading,
    isError,
    error,
  };
}

