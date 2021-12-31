import { toastError } from './RendererFunctions';

export function ErrorHandler(_error: Error | string): never {
  const error = typeof _error === 'string' ? new Error(_error) : _error;
  console.error(error);
  toastError(error.toString());
  throw error;
}
