import { store } from './store';
import { TodoFilter } from './todoState';
import { addTodo } from './todoState';
import { increment, asyncInc, decrement } from './counterState';
import { add, loadData, loadErrorData } from './complexState';

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
      complex: { emp: {} },
    });
  });

  it('add todo', () => {
    addTodo('Buy eags');
    expect(orbit.getState().todos.length).toBe(2);
  });

  it('increment', () => {
    increment(1);
    expect(orbit.getState().counter.count).toBe(1);
  });
  it('decrement', () => {
    decrement();
    expect(orbit.getState().counter.count).toBe(-1);
  });

  it('async increment', async () => {
    asyncInc();
    expect(orbit.getState().counter.loading).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(orbit.getState().counter.count).toBe(1);
    expect(orbit.getState().counter.loading).toBe(false);
  });

  it('complex state', async () => {
    loadData();
    console.log(orbit.getState().complex);
    expect(orbit.getState().complex.emp.loading).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 150));
    console.log(orbit.getState().complex);
    expect(orbit.getState().complex.emp?.data?.length).toBe(3);
  });

  it('complex state load error data', async () => {
    loadErrorData();
    console.log(orbit.getState().complex);
    expect(orbit.getState().complex.emp.loading).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 150));
    console.log(orbit.getState().complex);
    expect(orbit.getState().complex.emp.error).toBe('internal server error');
  });

  it('complex state add emp', async () => {
    add(10);
    console.log(orbit.getState().complex);
    expect(orbit.getState().complex.emp.loading).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 10));
    console.log(orbit.getState().complex);
    expect(orbit.getState().complex.emp?.data?.length).toBe(1);
  });
});
