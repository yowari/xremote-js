export function createMockFetch<T>(data: T): () => Promise<{ ok: boolean, json: () => T }> {
  return () => {
    return Promise.resolve({
      ok: true,
      json: () => data
    });
  };
}
