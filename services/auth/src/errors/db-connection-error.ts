export class DBConnectionError extends Error {
  reason = 'Error connection to DB'
  constructor() {
    super()

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DBConnectionError.prototype)
  }
}
