import { OrderCancelledEvent, OrderStatus } from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { Order } from '../../../models'
import { fakeId, createOrder } from '../../../lib'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = await createOrder()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: { id: fakeId() }
  }

  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { listener, data, msg }
}

it('cancells the order', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(order!.id).toEqual(data.id)
  expect(order!.version).toEqual(data.version)
  expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
