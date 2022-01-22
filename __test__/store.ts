import { combineReducers, orbit } from '../src';
import { counterState } from './counterState';
import { createStore, applyMiddleware } from 'redux';
import { todoState, todoFilterState } from './todoState';

export const store = () =>
  createStore(
    combineReducers({
      [counterState.name]: counterState.reducer,
      [todoState.name]: todoState.reducer,
      [todoFilterState.name]: todoFilterState.reducer,
    }),
    applyMiddleware(orbit)
  );
