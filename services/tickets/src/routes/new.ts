import { Router } from 'express'
import { requireAuth } from '@r1ogatix/common'

const router = Router()

router.post('/api/tickets', requireAuth, (req, res) => res.sendStatus(200))

export { router as createTicketRouter }
