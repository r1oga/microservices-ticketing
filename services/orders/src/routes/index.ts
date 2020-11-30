import { Router } from 'express'

import { createOrderRouter } from './new'
import { showOneOrderRouter } from './show-one'
import { showAllOrderRouter } from './show-all'
import { deleteOrderRouter } from './delete'

const router = Router()

router.use([
  createOrderRouter,
  showOneOrderRouter,
  showAllOrderRouter,
  deleteOrderRouter
])

export { router }
