import { Router } from 'express'
import { NotFoundError } from '@r1ogatix/common'

import { Order } from '../models'

const router = Router()

router.delete('/api/orders/:orderId', async (req, res) => {
  res.send({})
})

export { router as deleteOrderRouter }
