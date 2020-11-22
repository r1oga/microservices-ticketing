import { Request, Response, NextFunction } from 'express'
import { RequestValidationError, DBConnectionError } from '../errors'

export const errorHandler = (
  err: Error,
  r: Request,
  res: Response,
  n: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    const errors = err.errors.map(({ msg: message, param: field }) => {
      return { message, field }
    })

    return res.status(400).send({ errors })
  }

  if (err instanceof DBConnectionError) {
    return res.status(500).send({ errors: [{ message: err.reason }] })
  }

  res.status(400).send({ errors: [{ message: 'Something went wrong' }] })
}
