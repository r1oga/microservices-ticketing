import { Message } from 'node-nats-streaming'
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  NotFoundError
} from '@r1ogatix/common'

import { Ticket } from '../../models'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, id, version } = data
    const ticket = await Ticket.findOne({ _id: id, version: version - 1 })

    if (!ticket) throw new NotFoundError()

    ticket.set({ title, price })
    await ticket.save()

    msg.ack()
  }
}
