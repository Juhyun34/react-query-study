import { useQuery } from "@tanstack/react-query";
import { useTodos } from "./useTodos";

export function useTodoStats() {
  const { todos, isLoading, isError, error } = useTodos();

  // 통계를 별도 쿼리 키로 관리
  const { data: stats } = useQuery({
    queryKey: ["todos", "stats"],
    queryFn: () => {
      const total = todos.length;
      const completed = todos.filter((todo) => todo.completed).length;
      const active = total - completed;
      return { total, completed, active };
    },
    enabled: !!todos, // todos가 있을 때만 실행
    staleTime: 1000 * 60 * 5,
  });

  return {
    stats: stats || { total: 0, completed: 0, active: 0 },
    isLoading,
    isError,
    error,
  };
}

