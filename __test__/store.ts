import { combineReducers, orbit } from '../src';
import { counterSlice } from './counterState';
import { createStore, applyMiddleware } from 'redux';
import { todoSlice, todoFilterSlice } from './todoState';

export const store = () =>
  createStore(
    combineReducers({
      [counterSlice.name]: counterSlice.reducer,
      [todoSlice.name]: todoSlice.reducer,
      [todoFilterSlice.name]: todoFilterSlice.reducer,
    }),
    applyMiddleware(orbit)
  );
