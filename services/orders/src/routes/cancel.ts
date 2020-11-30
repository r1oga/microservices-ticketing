import { Router, Request, Response } from 'express'
import {
  NotFoundError,
  validateRequest,
  requireAuth,
  ForbiddenError,
  OrderStatus
} from '@r1ogatix/common'
import { param } from 'express-validator'

import { Order } from '../models'

const router = Router()

router.patch(
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
    const order = await Order.findById(orderId)

    if (!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id)
      throw new ForbiddenError('You are not the owner of this order')

    order.status = OrderStatus.Cancelled
    await order.save()

    // Publish event

    return res.status(200).send(order)
  }
)

export { router as deleteOrderRouter }
