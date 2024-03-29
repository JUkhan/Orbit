# Orbit

Orbit is a redux middleware that allows you to subscribe to effects based on action, and it works like a redux-thunk for the effects that pass to the createSlice() function. Orbit makes it fun to use Redux, Actions and Side Effects.

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

## Create a Redux State, Reducer and effects on it

```ts
import { createSlice, PayloadAction, createEffect } from 'orbit-redux';

export const counterSlice = createSlice({
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
    async asyncInc(action) {
      loading();
      await new Promise((resolve) =>
        setTimeout(() => increment(1), 100)
      );
    },
  },
});

export const { increment, decrement, loading, asyncInc } = counterSlice.actions;

//Also you can use createEffect function for app side effects
createEffect(increment, (action, getState, dispatch) => {
  console.log( action);
});

on(increment, decrement)
  .debounce(1000)
  .effect((action, getState, dispatch) => {
    console.log(action);
  });
```

## Create a Redux Store

```ts
import { createStore, applyMiddleware } from 'redux';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { combineReducers, orbit } from 'orbit-redux';
import { counterSlice } from './counterState';
import { todoSlice, todoFilterSlice } from './todoSlice';

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
  const { count, loading } = useAppSelector((state) => state.counter);
  return (
    <div>
      <h1>Counter</h1>
      <button onClick={() => increment(10)}>increment</button>
      <button onClick={() => decrement()}>decrement</button>
      <button onClick={() => asyncInc()}>
        {loading ? 'loading...' : 'asyncInc'}
      </button>
      <b>{count}</b>
    </div>
  );
};
```

[Demo](https://stackblitz.com/edit/orbit-demo-1?file=index.tsx)

## Develop an action specific selector

useSelectorByAcions() - a hook to select state for specific action/actions. unlike useSelector() that call selector function each and every time for any part of state changed.

```ts
import { ActionParam, useOrbitEffect } from 'orbit-redux';
import { useState } from 'react';
import { useStore } from 'react-redux';

export function useSelectorByAcions<S = any, TSelected = any>(
  acions: ActionParam,
  selector: (state: S) => TSelected,
  equalityFn: (left: TSelected, right: TSelected) => boolean = (left, right) =>
    left === right
) {
  const store = useStore();
  const [selectedState, setState] = useState(selector(store.getState()));
  let oldState = selectedState;
  useOrbitEffect(acions, () => {
    const newState = selector(store.getState());
    if (!equalityFn(newState, oldState)) {
      setState(newState);
      oldState = newState;
    }
  });

  return selectedState;
}
```

## Example

```ts
const todos = useSelectorByAcions(
  [setFilter, addTodo, toggleTodo],
  (state: RootState) => {
    switch (state.todoFilter) {
      case TodoFilter.SHOW_ALL:
        return state.todos;
      case TodoFilter.SHOW_COMPLETED:
        return state.todos.filter((todo) => todo.completed);
      case TodoFilter.SHOW_ACTIVE:
        return state.todos.filter((todo) => !todo.completed);
    }
  }
);
```
