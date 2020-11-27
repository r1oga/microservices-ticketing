import { Router } from 'express'

import { createTicketRouter } from './new'

const router = Router()

router.use([createTicketRouter])

export { router }
