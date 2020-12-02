import { Listener, OrderCreatedEvent, Subjects } from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { msFromNowUntil } from '../../lib'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = msFromNowUntil(data.expiresAt)

    await expirationQueue.add(
      { orderId: data.id },
      { delay: 10000 /* UPDATE TO 15 MIN FOR PROD*/ }
    )

    msg.ack()
  }
}
