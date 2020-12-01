import { OrderCancelledEvent } from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models'
import { fakeId } from '../../../lib'

const setup = async () => {
  // Instantiate listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  const ticket = Ticket.build({ title: 'test', price: 10, userId: fakeId() })
  await ticket.save()

  const orderId = fakeId()
  ticket.set({ orderId })
  await ticket.save()
  const { version, id } = ticket

  // Fake event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version,
    ticket: { id }
  }

  // Fake Message
  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { listener, ticket, data, msg }
}

it('sets the userId of the ticket to undefined', async () => {
  const { listener, ticket, data, msg } = await setup()
  expect(ticket.orderId).toEqual(ticket.orderId)

  // Call onMessage
  await listener.onMessage(data, msg)

  // Find ticket
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toBeUndefined()
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
  expect(JSON.parse(event[1])['orderId']).toBeUndefined()
})
