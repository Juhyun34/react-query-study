# React Query Study

## 핵심 정리

**현재 프로젝트는 API를 사용하지 않습니다!**
- 데이터는 **브라우저 메모리(RAM)**에만 저장됨
- 페이지 새로고침하면 **모든 데이터 사라짐**
- 실제 서버나 데이터베이스는 없음

---

## 데이터 저장 위치

### 1. **브라우저 메모리 (RAM)**
```
React Query 캐시 (메모리)
├── ["todos", "all"] → [{ id: 1, ... }, { id: 2, ... }]
├── ["todos", "active"] → [{ id: 1, ... }]
├── ["todos", "completed"] → []
└── ["todos", "stats"] → { total: 2, active: 2, completed: 0 }
```

### 2. **어디에 저장되나요?**
- `queryClient` 객체 안에 저장됨
- JavaScript 변수처럼 메모리에만 존재
- 하드디스크나 서버에 저장되지 않음

---

## 🔍 코드 동작 원리

### 초기 데이터 설정
```javascript
const initialTodos = [
  { id: 1, title: "리액트 공부하기", completed: false },
  { id: 2, title: "React Query 연습", completed: false },
];
```
→ 이건 그냥 코드에 하드코딩된 배열

### useQuery가 하는 일
```javascript
useQuery({
  queryKey: ["todos", "all"],
  queryFn: fetchTodos,
  initialData: initialTodos,
})
```
1. `queryKey`로 캐시에서 데이터 찾기
2. 없으면 `queryFn` 실행 (여기서는 `initialTodos` 반환)
3. 가져온 데이터를 **메모리 캐시에 저장**

### 데이터 추가/수정/삭제
```javascript
queryClient.setQueryData(["todos", "all"], (old) => [...old, newTodo]);
```
→ 이건 **메모리 캐시에 직접 쓰기**하는 것
→ 서버 API 호출 없음

---

## 중요한 점

### 1. **영구 저장 안 됨**
- 페이지 새로고침 → 데이터 사라짐
- 브라우저 닫기 → 데이터 사라짐
- 다른 탭에서 열기 → 데이터 공유 안 됨

### 2. **실제 서버가 필요한 경우**
```javascript
// 실제 API 사용 예시
const fetchTodos = async () => {
  const response = await fetch('https://api.example.com/todos');
  return response.json();
};

const addMutation = useMutation({
  mutationFn: async (title) => {
    const response = await fetch('https://api.example.com/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return response.json();
  },
});
```

### 3. **영구 저장이 필요하면?**
- localStorage/sessionStorage 사용
- 또는 실제 서버 API 연결
- 또는 데이터베이스 사용

---

## 학습 포인트

1. **React Query는 캐시 관리 도구**
   - 서버 데이터를 메모리에 캐싱
   - 여기서는 서버 없이 메모리만 사용

2. **setQueryData = 메모리에 직접 쓰기**
   - 서버 API 없어도 데이터 변경 가능
   - UI에 즉시 반영됨

3. **queryKey = 메모리 저장소의 주소**
   - `["todos", "all"]` = 메모리 어딘가의 주소
   - 이 주소로 데이터 저장/조회
