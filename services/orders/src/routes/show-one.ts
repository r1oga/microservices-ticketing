import { Router, Response, Request } from 'express'
import { NotFoundError, requireAuth, validateRequest } from '@r1ogatix/common'
import { param } from 'express-validator'

import { Order } from '../models'

const router = Router()

router.get(
  '/api/orders/:orderId',
  requireAuth,
  [
    param('orderId')
      .isMongoId()
      .withMessage('Incorrectly formatted orderId (must be Mongo Object ID')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const orderId: string = req.params.orderId
    const orders = await Order.findById(orderId).populate('ticket')

    if (!orders) throw new NotFoundError()
    return res.status(200).send(orders)
  }
)

export { router as showOneOrderRouter }
