export interface ErrorDetails {
  code: string;
  message: string;
}

export class XboxError extends Error {
  constructor(error: ErrorDetails) {
    super(error.message);
    super.name = error.code;
  }
}
