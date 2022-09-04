import {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
} from './typeHelper';
import { __helper } from './orbit';

export function createAction<P = void, T extends string = string>(
  type: string
): ActionCreatorWithoutPayload<T> | ActionCreatorWithPayload<P, T> {
  const fx = (payload?: P): any => {
    return payload
      ? __helper.dispatch({ type, payload })
      : __helper.dispatch({ type });
  };
  fx._$atype = type;
  return fx;
}
