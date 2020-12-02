import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderStatus,
  Subjects
} from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { Order } from '../../models'
import { queueGroupName } from './queue-group-name'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id: orderId, version } = data
    const order = await Order.findOne({ _id: orderId, version: version - 1 })

    if (!order) throw new NotFoundError()

    order.set({ status: OrderStatus.Cancelled })
    await order.save()
    msg.ack()
  }
}
