import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects
} from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { Ticket } from '../../models'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const {
      id: orderId,
      ticket: { id: ticketId }
    } = data
    // Find ticket order is reserving
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) throw new NotFoundError()

    // Mark ticket as reserved by setting it orderId property
    ticket.set({ orderId })
    await ticket.save()
    msg.ack()

    // Emit event as we just modified the ticket
  }
}
