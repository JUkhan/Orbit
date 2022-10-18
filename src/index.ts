import { combineReducers } from './combineReducers';
import { createSlice } from './createSlice';
export * from './typeHelper';
import { orbit, useOrbitEffect, createEffect, on } from './orbit';
import { createAction } from './createAction';

export {
  combineReducers,
  createSlice,
  orbit,
  useOrbitEffect,
  createAction,
  createEffect,
  on,
};
export type Data<T>={
  loading?:boolean,
  data?:T,
  error?:string
}