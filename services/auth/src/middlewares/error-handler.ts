import { CustomError } from '../errors/custom-error'
import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: CustomError,
  r: Request,
  res: Response,
  n: NextFunction
) => res.status(err.statusCode).send(err.serializeErrors())
