import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
  OrderStatus
} from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { Ticket } from '../../models'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const {
      ticket: { id: ticketId }
    } = data

    // Find ticket order is reserving
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) throw new NotFoundError()

    // Mark ticket as reserved by setting it orderId property
    ticket.set({ orderId: undefined })
    await ticket.save()

    // Emit event as we just modified the ticket
    // await it because we don't want to ack if the publish fails
    await new TicketUpdatedPublisher(this.client).publish(Object.assign(ticket))

    msg.ack()
  }
}
