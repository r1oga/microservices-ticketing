import { OrderCreatedEvent, OrderStatus } from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { Order } from '../../../models'
import { fakeId } from '../../../lib'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: fakeId(),
    version: 0,
    expiresAt: 'ad',
    userId: fakeId(),
    status: OrderStatus.Created,
    ticket: { id: fakeId(), price: 10 }
  }

  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { listener, data, msg }
}

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(order!.price).toEqual(data.ticket.price)
  expect(order!.id).toEqual(data.id)
  expect(order!.version).toEqual(data.version)
  expect(order!.userId).toEqual(data.userId)
  expect(order!.status).toEqual(data.status)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
