import { createSlice, PayloadAction, on, Data } from '../src';

export const counterState = createSlice({
  name: 'counter',
  initialState: { count: 0, loading: false },
  reducers: {
    increment(state, action: PayloadAction<number>) {
      return { count: state.count + action.payload, loading: false };
    },
    decrement(state) {
      return { count: state.count - 1, loading: false };
    },
    loading(state) {
      return { ...state, loading: true };
    },
  },

  effects: {
    async asyncInc(action: PayloadAction<string>, put) {
      console.log(action.payload);
      loading();
      await new Promise((resolve) => setTimeout(() => increment(1), 100));
    },
  },
});

export const { increment, decrement, loading, asyncInc } = counterState.actions;

on(increment, decrement)
  // .debounce(10)
  .effect((action, getData, dis) => {
    console.log(action, getData(), dis, '::::');
  });
