import { Router } from 'express'

import { createTicketRouter } from './new'
import { showOneTicketRouter } from './show-one'
import { showAllTicketRouter } from './show-all'

const router = Router()

router.use([createTicketRouter, showOneTicketRouter, showAllTicketRouter])

export { router }
