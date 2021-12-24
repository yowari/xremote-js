import { wait } from './wait';

export interface RetryOptions<T> {
  task: () => Promise<T>;
  retries: number;
  retryDelay: number;
  retryOn: (result: T) => boolean | Promise<boolean>;
}

/**
 * Try to execute a function until it succeed.
 *
 * @param options The task parameters
 * @returns A promise resolving to the task function return
 */
export async function execWithRetry<T>(options: RetryOptions<T>): Promise<T> {
  let shouldRetry = false;
  let response: T | null = null;

  try {
    response = await options.task();
  } catch {
    shouldRetry = true;
  }

  if (!shouldRetry) {
    shouldRetry = await options.retryOn(response as T);
  }

  if (shouldRetry) {
    if (options.retries > 0) {
      await wait(options.retryDelay);
      response = await execWithRetry({
        ...options,
        retries: options.retries - 1
      });
    } else {
      throw new Error('Exceeded the number of retries');
    }
  }

  return response as T;
}
