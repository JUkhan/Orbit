import { store } from './store';
import { TodoFilter } from './todoState';
import { addTodo } from './todoState';
import { increment, asyncInc } from './counterState';

describe('Orbit', () => {
  var orbit = store();
  beforeEach(() => {
    orbit = store();
  });

  it('initial state', () => {
    expect(orbit.getState()).toEqual({
      counter: { count: 0, loading: false },
      todos: [{ id: 1, text: 'Learn FP', completed: false }],
      todoFilter: TodoFilter.SHOW_ALL,
    });
  });

  it('add todo', () => {
    orbit.dispatch(addTodo('Buy eags'));
    expect(orbit.getState().todos.length).toBe(2);
  });

  it('incremen', () => {
    orbit.dispatch(increment(1));
    expect(orbit.getState().counter.count).toBe(1);
  });

  it('async increment', async () => {
    orbit.dispatch(asyncInc('asyncInc - in action'));
    expect(orbit.getState().counter.loading).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(orbit.getState().counter.count).toBe(1);
    expect(orbit.getState().counter.loading).toBe(false);
  });
});
