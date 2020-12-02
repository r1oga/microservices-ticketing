import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError
} from '@r1ogatix/common'

const router = Router()

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').notEmpty().withMessage('Token must be provided'),
    body('orderId').notEmpty().withMessage('orderId must be provided')
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.send({ success: true })
  }
)

export { router as createChargeRouter }
