import { combineReducers, orbit, createEffect } from '../src';
import { counterState, increment } from './counterState';
import { createStore, applyMiddleware } from 'redux';
import { todoState, todoFilterState } from './todoState';
import { complexState } from './complexState';

export const store = () =>
  createStore(
    combineReducers({
      [counterState.name]: counterState.reducer,
      [todoState.name]: todoState.reducer,
      [todoFilterState.name]: todoFilterState.reducer,
      [complexState.name]: complexState.reducer,
    }),
    applyMiddleware(orbit)
  );

createEffect(increment, (action, getState, dispatch) => {
  console.log(dispatch, getState(), action, '--------');
});
