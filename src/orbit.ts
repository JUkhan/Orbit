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
      effectMap.forEach((cal) => cal(dispatch, getState, action));
      return next(action);
    };
}

export const orbit = createOrbitMiddleware();

export function subscribeEffect(
  actionTypes: string[],
  callback: EffectHandler
) {
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

export function effectOn(...actionTypes: string[]) {
  return {
    subscribe: (callback: EffectHandler) => {
      return subscribeEffect(actionTypes, callback);
    },
  };
}

export function useOrbitEffect(
  acionTypes: ActionParam,
  callbackFn: EffectHandler
) {
  useIsomorphicLayoutEffect(() => {
    let actions: ActionFn[] = Array.isArray(acionTypes)
      ? acionTypes
      : [acionTypes];
    const sub = subscribeEffect(
      actions.map((a) => a().type),
      callbackFn
    );
    return () => {
      sub.unsubscribe();
    };
  }, []);
}
