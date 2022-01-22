import {
  combineReducers as _combineReducers,
  Reducer,
  Action,
  AnyAction,
} from 'redux';
import { CombinedState, ReducersMapObject } from './typeHelper';

export function combineReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<CombinedState<S>> {
  return _combineReducers(reducers) as any;
}
