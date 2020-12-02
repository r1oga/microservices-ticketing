import { Listener, OrderCreatedEvent, Subjects } from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { Order } from '../../models'
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const {
      id,
      ticket: { price },
      status,
      userId,
      version
    } = data
    const order = Order.build({ id, price, status, userId, version })

    await order.save()
    msg.ack()
  }
}
