import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@r1ogatix/common'

const router = Router()

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').isString().notEmpty().withMessage('Invalid title'),
    body('price').isNumeric().withMessage('Invalid Price')
  ],
  validateRequest,
  (req: Request, res: Response) => res.sendStatus(200)
)

export { router as createTicketRouter }
