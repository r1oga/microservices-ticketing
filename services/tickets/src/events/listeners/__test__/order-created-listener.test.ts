import { OrderCreatedEvent, OrderStatus } from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models'
import { fakeId } from '../../../lib'

const setup = async () => {
  // Instantiate listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  const ticket = Ticket.build({ title: 'test', price: 10, userId: fakeId() })
  await ticket.save()

  const { version, price, userId, id } = ticket

  // Fake event
  const data: OrderCreatedEvent['data'] = {
    id: fakeId(),
    version,
    status: OrderStatus.Created,
    userId,
    expiresAt: 'asdad',
    ticket: {
      id,
      price
    }
  }

  // Fake Message
  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { listener, ticket, data, msg }
}

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup()

  // Call onMessage
  await listener.onMessage(data, msg)

  // Find ticket
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.userId).toEqual(data.userId)
  expect(updatedTicket!.version).toEqual(ticket.version + 1)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket:updated event', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const { calls } = (natsWrapper.client.publish as jest.Mock).mock
  const event = calls[0]
  expect(event[0]).toEqual('ticket:updated')
  expect(JSON.parse(event[1])['orderId']).toEqual(data.id)
})
