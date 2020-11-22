import { CustomError } from './custom-error'

export class UnauthorizedError extends CustomError {
  statusCode = 401

  constructor() {
    super('Not authorized')

    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }

  serializeErrors() {
    return { errors: [{ message: 'Not authorized' }] }
  }
}
