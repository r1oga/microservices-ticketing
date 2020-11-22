import cookieSession from 'cookie-session'
import express from 'express'

const middlewares = [
  express.json(),
  cookieSession({ signed: false, secure: true })
]

export { middlewares }
export { errorHandler } from './error-handler'
