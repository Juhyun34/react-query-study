import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const initialTodos = [
  { id: 1, title: "리액트 공부하기", completed: false },
  { id: 2, title: "React Query 연습", completed: false },
];

const fetchTodos = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return initialTodos;
};

export function useTodos() {
  const queryClient = useQueryClient();

  // 데이터 조회
  const {
    data: todos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["todos", "all"], // 캐시 키
    queryFn: fetchTodos, // 데이터 가져오는 함수
    initialData: initialTodos, // 초기 데이터
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
  });

  // 추가
  const addMutation = useMutation({
    mutationFn: async (title) => {
      // 서버 API 호출
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { id: Date.now(), title, completed: false };
    },
    onMutate: async (title) => {
      // optimistic update: 서버 응답 전에 UI 먼저 업데이트
      await queryClient.cancelQueries({ queryKey: ["todos", "all"] });
      const previousTodos = queryClient.getQueryData(["todos", "all"]);
      
      const optimisticTodo = { id: `temp-${Date.now()}`, title, completed: false };
      queryClient.setQueryData(["todos", "all"], (old) => [
        ...(old || []),
        optimisticTodo,
      ]);
      
      queryClient.setQueryData(["todos", "active"], (old) => [
        ...(old || []),
        optimisticTodo,
      ]);
      queryClient.setQueryData(["todos", "stats"], (old) => ({
        total: (old?.total || 0) + 1,
        completed: old?.completed || 0,
        active: (old?.active || 0) + 1,
      }));

      return { previousTodos, optimisticTodo };
    },
    onError: (err, title, context) => {
      // 실패 시 이전 상태로 롤백
      queryClient.setQueryData(["todos", "all"], context.previousTodos);
      queryClient.setQueryData(["todos", "active"], (old) =>
        old.filter((t) => t.title !== title)
      );
      queryClient.setQueryData(["todos", "stats"], (old) => ({
        total: (old?.total || 0) - 1,
        completed: old?.completed || 0,
        active: (old?.active || 0) - 1,
      }));
    },
    onSuccess: (newTodo, title, context) => {
      // 성공 시 서버 응답으로 최종 업데이트
      queryClient.setQueryData(["todos", "all"], (old) =>
        old.map((t) => (t.id === context.optimisticTodo.id ? newTodo : t))
      );
      queryClient.setQueryData(["todos", "active"], (old) =>
        old.map((t) => (t.id === context.optimisticTodo.id ? newTodo : t))
      );
    },
  });

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return id;
    },
    onMutate: async (id) => {
      // optimistic update
      await queryClient.cancelQueries({ queryKey: ["todos", "all"] });
      const previousTodos = queryClient.getQueryData(["todos", "all"]);
      
      const todoToDelete = previousTodos?.find((t) => t.id === id);
      queryClient.setQueryData(["todos", "all"], (old) =>
        old.filter((t) => t.id !== id)
      );
      
      if (todoToDelete?.completed) {
        queryClient.setQueryData(["todos", "completed"], (old) =>
          old.filter((t) => t.id !== id)
        );
      } else {
        queryClient.setQueryData(["todos", "active"], (old) =>
          old.filter((t) => t.id !== id)
        );
      }
      
      queryClient.setQueryData(["todos", "stats"], (old) => ({
        total: (old?.total || 0) - 1,
        completed: todoToDelete?.completed
          ? (old?.completed || 0) - 1
          : old?.completed || 0,
        active: todoToDelete?.completed
          ? old?.active || 0
          : (old?.active || 0) - 1,
      }));

      return { previousTodos };
    },
    onError: (err, id, context) => {
      // 롤백
      queryClient.setQueryData(["todos", "all"], context.previousTodos);
      const todoToDelete = context.previousTodos?.find((t) => t.id === id);
      if (todoToDelete?.completed) {
        queryClient.setQueryData(["todos", "completed"], (old) => [
          ...(old || []),
          todoToDelete,
        ]);
      } else {
        queryClient.setQueryData(["todos", "active"], (old) => [
          ...(old || []),
          todoToDelete,
        ]);
      }
      queryClient.setQueryData(["todos", "stats"], (old) => ({
        total: (old?.total || 0) + 1,
        completed: todoToDelete?.completed
          ? (old?.completed || 0) + 1
          : old?.completed || 0,
        active: todoToDelete?.completed
          ? old?.active || 0
          : (old?.active || 0) + 1,
      }));
    },
    onSuccess: () => {},
  });

  // 완료 토글
  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { id, completed };
    },
    onMutate: async ({ id, completed }) => {
      // optimistic update
      await queryClient.cancelQueries({ queryKey: ["todos", "all"] });
      const previousTodos = queryClient.getQueryData(["todos", "all"]);
      
      queryClient.setQueryData(["todos", "all"], (old) =>
        old.map((t) => (t.id === id ? { ...t, completed } : t))
      );
      
      const todo = previousTodos?.find((t) => t.id === id);
      if (completed) {
        queryClient.setQueryData(["todos", "active"], (old) =>
          old.filter((t) => t.id !== id)
        );
        queryClient.setQueryData(["todos", "completed"], (old) => [
          ...(old || []).filter((t) => t.id !== id),
          { ...todo, completed: true },
        ]);
      } else {
        queryClient.setQueryData(["todos", "completed"], (old) =>
          old.filter((t) => t.id !== id)
        );
        queryClient.setQueryData(["todos", "active"], (old) => [
          ...(old || []).filter((t) => t.id !== id),
          { ...todo, completed: false },
        ]);
      }
      
      queryClient.setQueryData(["todos", "stats"], (old) => ({
        total: old?.total || 0,
        completed: completed
          ? (old?.completed || 0) + 1
          : (old?.completed || 0) - 1,
        active: completed
          ? (old?.active || 0) - 1
          : (old?.active || 0) + 1,
      }));

      return { previousTodos };
    },
    onError: (err, variables, context) => {
      // 롤백
      queryClient.setQueryData(["todos", "all"], context.previousTodos);
      const todo = context.previousTodos?.find((t) => t.id === variables.id);
      if (variables.completed) {
        queryClient.setQueryData(["todos", "active"], (old) => [
          ...(old || []).filter((t) => t.id !== variables.id),
          todo,
        ]);
        queryClient.setQueryData(["todos", "completed"], (old) =>
          old.filter((t) => t.id !== variables.id)
        );
      } else {
        queryClient.setQueryData(["todos", "completed"], (old) => [
          ...(old || []).filter((t) => t.id !== variables.id),
          todo,
        ]);
        queryClient.setQueryData(["todos", "active"], (old) =>
          old.filter((t) => t.id !== variables.id)
        );
      }
      queryClient.setQueryData(["todos", "stats"], (old) => ({
        total: old?.total || 0,
        completed: variables.completed
          ? (old?.completed || 0) - 1
          : (old?.completed || 0) + 1,
        active: variables.completed
          ? (old?.active || 0) + 1
          : (old?.active || 0) - 1,
      }));
    },
    onSuccess: () => {},
  });

  const addTodo = (title) => addMutation.mutate(title);
  const deleteTodo = (id) => deleteMutation.mutate(id);
  const toggleTodo = (id, completed) =>
    toggleMutation.mutate({ id, completed });

  return {
    todos,
    isLoading,
    isError,
    error,
    refetch,
    addTodo,
    deleteTodo,
    toggleTodo,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,
    addError: addMutation.error,
    deleteError: deleteMutation.error,
    toggleError: toggleMutation.error,
  };
}
