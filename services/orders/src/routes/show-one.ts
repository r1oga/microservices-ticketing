import { Router } from 'express'
import { NotFoundError, requireAuth } from '@r1ogatix/common'

import { Order } from '../models'

const router = Router()

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async ({ params: { orderId } }, res) => {
    const orders = await Order.findById(orderId).populate('ticket')

    if (!orders) throw new NotFoundError()
    return res.status(200).send(orders)
  }
)

export { router as showOneOrderRouter }
