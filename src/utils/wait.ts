/**
 * The function resolves until it timeout.
 *
 * @param ms wait time in miliseconds
 * @returns resolves when time exceeds
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
