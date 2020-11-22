import { Router, Request, Response } from 'express'
import { validateRequest } from '../middlewares'
import { body } from 'express-validator'
const router = Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid/provided'),
    body('password').trim().notEmpty().withMessage('Password must be provided')
  ],
  validateRequest,
  (req: Request, res: Response) => {}
)

export { router as signinRouter }
