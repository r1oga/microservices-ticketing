import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  NotFoundError,
  OrderStatus
} from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  queueGroupName = queueGroupName
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    // Find order
    const order = await Order.findById(data.orderId).populate('ticket')
    if (!order) throw new NotFoundError()

    // unreserve ticket
    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    // emit order:cancelled event
    // await before ack
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id }
    })

    msg.ack()
  }
}
