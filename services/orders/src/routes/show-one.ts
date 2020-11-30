import { Router } from 'express'
import { NotFoundError } from '@r1ogatix/common'

import { Order } from '../models'

const router = Router()

router.get('/api/orders/:orderId', async ({ params: { orderId } }, res) => {
  const order = '' //await Order.findById(orderId)

  if (!order) throw new NotFoundError()
  return res.status(200).send(order)
})

export { router as showOneOrderRouter }
