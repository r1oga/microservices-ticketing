import { Message } from 'node-nats-streaming'
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
  NotFoundError
} from '@r1ogatix/common'

import { queueGroupName } from './queue-group-name'
import { Order } from '../../models'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
  queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data

    // Update order status
    const order = await Order.findById(orderId)
    if (!order) throw new NotFoundError()

    order.set({ status: OrderStatus.Complete })
    await order.save()

    // TODO define OrderUpdatedPublisher
    // and emit order:updated event

    msg.ack()
  }
}
