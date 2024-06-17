export class HttpError extends Error {
  constructor(public response: Response) {
    super(`request failed with error "${response.statusText}"`);
    this.name = 'HTTP Error';
  }
}

export function handleError(response: Response): Response {
  if (!response.ok) {
    throw new HttpError(response);
  }
  return response;
}
