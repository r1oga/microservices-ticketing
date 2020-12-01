import { OrderStatus, ExpirationCompleteEvent } from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Order, Ticket } from '../../../models'
import { createTicket, createOrder } from '../../../lib'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)
  const ticket = await createTicket()
  const order = await createOrder({
    userId: 'adsa',
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket
  })

  const data: ExpirationCompleteEvent['data'] = { orderId: order.id }

  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { listener, data, msg, order }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order:cancelled event', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
  const event = (natsWrapper.client.publish as jest.Mock).mock.calls[0]

  expect(event[0]).toEqual('order:cancelled')
  expect(JSON.parse(event[1])['id']).toEqual(order.id)
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
