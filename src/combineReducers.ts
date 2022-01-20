import { combineReducers as comRed, Reducer, Action, AnyAction } from 'redux';
import { CombinedState, ReducersMapObject } from './typeHelper';

export function combineReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<CombinedState<S>> {
  return comRed(reducers) as any;
}
