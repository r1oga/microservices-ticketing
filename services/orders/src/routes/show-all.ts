import { Router } from 'express'

import { Order } from '../models'

const router = Router()

router.get('/api/orders', async (_, res) => {
  const orders = '' //await Order.find({})

  return res.status(200).send(orders)
})

export { router as showAllOrderRouter }
