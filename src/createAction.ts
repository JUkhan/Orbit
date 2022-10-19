import {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
} from './typeHelper';
import { __helper } from './orbit';

export function createAction<P = void, T extends string = string>(
  type: string
): ActionCreatorWithoutPayload<T> | ActionCreatorWithPayload<P, T> {
  const fx = (payload?: P): any =>
    __helper.dispatch({ type, payload: payload });
  fx._$atype = type;
  return fx;
}
