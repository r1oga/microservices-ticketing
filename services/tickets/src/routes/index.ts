import { Router } from 'express'

import { createTicketRouter } from './new'
import { showTicketRouter } from './show'

const router = Router()

router.use([createTicketRouter, showTicketRouter])

export { router }
