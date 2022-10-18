import { createAction } from './createAction';
import {
  Slice,
  ReducerMetods,
  SliceOptions,
  EffectHandlers,
} from './typeHelper';

import { __helper } from './orbit';

/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "state name", and also it can have an object full of effect handlers, and automatically generates
 * action creators and action types that correspond to the
 * reducers and state and effects.
 *
 */
export function createSlice<
  State,
  CR extends ReducerMetods<State>,
  M extends EffectHandlers,
  Name extends string = string
>(options: SliceOptions<State, CR, M, Name>): Slice<State, CR, M, Name> {
  if (!options.name) {
    throw new Error('`name` is a required option for reducer');
  }

  const reducers: any = options.reducers || {};
  const actions: any = {};
  const effects: any = options.effects || {};
  const actionRegx = new RegExp(
    `^${options.name}.+(?:request|success|failure)$`,
    'i'
  );
  function reducer(state: any = options.initialState, action: any) {
    if (reducers[action.type]) {
      return reducers[action.type](state, action);
    } else if (actionRegx.test(action.type)) {
      return { ...state, [action.key]: action.data };
    }
    return state;
  }

  Object.keys(reducers).map((key) => {
    const mkey = `${options.name}_${key}`;
    reducers[mkey] = reducers[key];
    reducers[key] = undefined;
    actions[key] = createAction(mkey);
  });
  const resolveEffect =
    (effectKey: string, state: () => any) =>
    (key: string, apiData: Promise<any>) => {
      const currentData = state()[options.name][key].data;
      __helper.dispatch({
        type: `${options.name}_${effectKey}_request`,
        key,
        data: { loading: true, data: currentData, error: null },
      });

      apiData
        .then((data) =>
          __helper.dispatch({
            type: `${options.name}_${effectKey}_success`,
            key,
            data: { loading: false, data, error: null },
          })
        )
        .catch((err) =>
          __helper.dispatch({
            type: `${options.name}_${effectKey}_failure`,
            key,
            data: {
              loading: false,
              data: currentData,
              error: err.message ? err.message : err,
            },
          })
        );
    };
  Object.keys(effects).map((key) => {
    const handler = effects[key];
    actions[key] = (payload: any) =>
      __helper.dispatch((dispatch: any, getState: any) =>
        handler({ payload }, resolveEffect(key, getState), getState, dispatch)
      );
  });

  return {
    name: options.name,
    actions,
    reducer,
  };
}
