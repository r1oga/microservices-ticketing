import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  ForbiddenError,
  NotFoundError
} from '@r1ogatix/common'

import { Ticket } from '../models'
import { TicketUpdatedPublisher } from '../events'
import { natsWrapper } from '../nats-wrapper'

const router = Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title')
      .notEmpty()
      .isString()
      .withMessage('Valid title required (not empty string)'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required (> 0)')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      currentUser,
      params: { id },
      body: { title, price }
    } = req

    const ticket = await Ticket.findById(id)
    if (!ticket) throw new NotFoundError()
    if (ticket.userId !== currentUser!.id)
      throw new ForbiddenError('You are not the creator of this ticket')

    // Update ticket in DB
    ticket.set({ title, price })
    await ticket.save()

    // emit event
    new TicketUpdatedPublisher(natsWrapper.client).publish(
      Object.assign(ticket, { id: ticket.id })
    )

    return res.status(200).send(ticket)
  }
)

export { router as updateTicketRouter }
