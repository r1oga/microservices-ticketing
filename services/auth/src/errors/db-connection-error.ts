import { CustomError } from './custom-error'

export class DBConnectionError extends CustomError {
  statusCode = 500
  reason = 'Error connection to DB'
  constructor() {
    super()

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DBConnectionError.prototype)
  }

  serializeErrors() {
    return { errors: [{ message: this.reason }] }
  }
}
