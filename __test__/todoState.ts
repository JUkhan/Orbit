import { createSlice, PayloadAction } from '../src';

export enum TodoFilter {
  SHOW_ALL = 'SHOW_ALL',
  SHOW_COMPLETED = 'SHOW_COMPLETED',
  SHOW_ACTIVE = 'SHOW_ACTIVE',
}

export const todoState = createSlice({
  name: 'todos',
  initialState: [{ id: 1, text: 'Learn FP', completed: false }],
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      return [
        ...state,
        { id: Number(new Date()), text: action.payload, completed: false },
      ];
    },
    removeTodo(state, action: PayloadAction<number>) {
      return state.filter((todo) => todo.id !== action.payload);
    },
    toggleTodo(state, action: PayloadAction<number>) {
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    },
  },
});

export const { addTodo, removeTodo, toggleTodo } = todoState.actions;

export const todoFilterState = createSlice({
  name: 'todoFilter',
  initialState: TodoFilter.SHOW_ALL,
  reducers: {
    setFilter(state, action: PayloadAction<TodoFilter>) {
      return action.payload;
    },
  },
});
export const { setFilter } = todoFilterState.actions;
