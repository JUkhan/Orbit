import { useIsomorphicLayoutEffect } from './utils/useIsomorphicLayoutEffect';
import { Action, AnyAction } from 'redux';
import { EffectHandler, ActionParam, ActionFn } from './typeHelper';

const effectMap = new Map<string, any>();

function createOrbitMiddleware() {
  return ({
      dispatch,
      getState,
    }: {
      dispatch: (action: Action) => void;
      getState: () => any;
    }) =>
    (next: any) =>
    (action: any) => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      effectMap.forEach((cal) => cal(dispatch, getState, action));
      return next(action);
    };
}

/**
 * Orbit is a redux middleware that allows you to subscribe to effects based on action, and
 * it also works like a redux-thunk for the effects inside the creatReducer() function.
 *
 */
export const orbit = createOrbitMiddleware();

function subscribeEffect(actionTypes: string[], callback: EffectHandler) {
  let key = Number(new Date()).toString() + Math.random();
  let notifyCallback = (dispatch: any, getData: any, action: AnyAction) => {
    if (actionTypes.includes(action.type)) {
      callback(
        (newAction: AnyAction) => dispatch(newAction),
        () => getData(),
        action
      );
    }
  };
  effectMap.set(key, notifyCallback);

  return {
    unsubscribe: () => {
      effectMap.delete(key);
    },
  };
}

/**
 * A hook that allows you to manage side effects in your component based on the action/s.
 * And it will automatically unsubscribe when the component unmounts.
 * @param acions An array of action functions or a single action funcion - `generated from createAction()`.
 * @param handlerFn A function that accepts the dispatch, getState and action.
 */
export function useOrbitEffect(acions: ActionParam, handlerFn: EffectHandler) {
  useIsomorphicLayoutEffect(() => {
    let _actions: ActionFn[] = Array.isArray(acions) ? acions : [acions];
    const sub = subscribeEffect(
      _actions.map((a) => a().type),
      handlerFn
    );
    return () => {
      sub.unsubscribe();
    };
  }, []);
}
