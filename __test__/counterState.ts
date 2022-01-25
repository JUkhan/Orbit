import { createSlice, PayloadAction, createAction } from '../src';

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
    async asyncInc(dispatch, _, action: PayloadAction<string>) {
      console.log(action.payload);
      dispatch(loading());
      await new Promise((resolve) =>
        setTimeout(() => dispatch(increment(1)), 100)
      );
    },
  },
});

export const { increment, decrement, loading, asyncInc } = counterState.actions;
