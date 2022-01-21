# Orbit

Orbit is a redux middleware that allows you to subscribe to effects based on action.

## Installation

Add the Orbit, Redux and React-Redux packages to your project:

```
# NPM
npm i orbit-redux redux react-redux
```

```
# YARN
yarn add orbit-redux redux react-redux
```

## Create a Redux State Reducer

```ts
import { createReducer, PayloadAction } from 'orbit-redux';

export interface CouterState {
  count: number;
  loading: boolean;
}

export const counterSlice = createReducer({
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
    async asyncInc(dispatch) {
      dispatch(loading());
      await new Promise((resolve) =>
        setTimeout(() => dispatch(increment(1)), 100)
      );
    },
  },
});

export const { increment, decrement, loading, asyncInc } = counterSlice.actions;
```

## Create a Redux Store

```ts
import { createStore, applyMiddleware } from 'redux';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { combineReducers, orbit } from 'orbit-redux';
import { counterSlice } from './counter/counterState';
import { todoSlice, todoFilterSlice } from './todo/todoState';

export const store = createStore(
  combineReducers({
    [counterSlice.name]: counterSlice.reducer,
    [todoSlice.name]: todoSlice.reducer,
    [todoFilterSlice.name]: todoFilterSlice.reducer,
  }),
  applyMiddleware(orbit)
);

type RootState = ReturnType<typeof store.getState>;
type Dispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => Dispatch = useDispatch;
```

## Provide the Redux Store to React

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { store } from './features/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

## Use Redux State and Actions and Orbit Effects in React Components

```ts
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { asyncInc, decrement, increment } from './counterState';
import { useOrbitEffect } from 'orbit-redux';

export default () => {
  // useOrbitEffect([increment, decrement], (dispatch, getState, action) => {
  //   console.log(action);
  // });

  const { count, loading } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Counter</h1>
      <button onClick={() => dispatch(increment(10))}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>
      <button onClick={() => dispatch(asyncInc())}>
        {loading ? 'loading...' : 'asyncInc'}
      </button>
      <b>{count}</b>
    </div>
  );
};
```

[Demo](https://stackblitz.com/edit/orbit-demo-1?file=index.tsx)
