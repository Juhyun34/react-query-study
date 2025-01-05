import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTodos() {
  const queryClient = useQueryClient();

  // 초기 데이터
  const initialTodos = [
    { id: 1, title: "리액트 공부하기" },
    { id: 2, title: "React Query 연습" },
  ];

  // useQuery
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: () => [], // 서버 없음
    initialData: initialTodos,
  });

  // 추가
  const addMutation = useMutation({
    mutationFn: (title) => ({ id: Math.random(), title }),
    onSuccess: (newTodo) => {
      queryClient.setQueryData(["todos"], (old) => [...old, newTodo]);
    },
  });

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: (id) => id,
    onSuccess: (id) => {
      queryClient.setQueryData(["todos"], (old) =>
        old.filter((t) => t.id !== id)
      );
    },
  });

  // CRUD 함수 반환
  const addTodo = (title) => addMutation.mutate(title);
  const deleteTodo = (id) => deleteMutation.mutate(id);

  return { todos, addTodo, deleteTodo };
}
