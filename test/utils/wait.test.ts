import { wait } from '../../src/utils/wait';

describe('wait', () => {

  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');

  test('should resolves when the approriate time passes', () => {
    const waitTime = 1000;
    wait(waitTime);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), waitTime);
  });

});
