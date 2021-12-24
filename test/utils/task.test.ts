import { execWithRetry } from '../../src/utils/task';

describe('execWithRetry', () => {
  test('should execute the function and return what have been returned by the function when succeed', async () => {
    const resolvedValue = 'Resolved Value';

    const response = await execWithRetry({
      task: () => Promise.resolve(resolvedValue),
      retries: 0,
      retryDelay: 0,
      retryOn: () => false
    });

    expect(response).toBe(resolvedValue);
  });

  test('should retry when function throw error', async () => {
    const retries = 5;
    const taskFn = jest.fn().mockRejectedValue(null);

    try {
      await execWithRetry({
        task: taskFn,
        retries,
        retryDelay: 0,
        retryOn: () => false
      });
    } catch (e) {
      expect(taskFn).toBeCalledTimes(retries + 1);
    }
  });
});
