import { TicketUpdatedEvent } from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { fakeId, createTicket } from '../../../lib'
import { Ticket } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketUpdatedListener } from '../ticket-updated-listener'

const setup = async () => {
  // instantiate a listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // Create ticket
  const id = fakeId()
  const ticket = await createTicket({
    title: 'test',
    price: 10,
    id
  })

  // Fake an event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id,
    title: 'new',
    price: 999,
    userId: fakeId()
  }

  // Fake a msg
  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { ticket, listener, data, msg }
}

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()

  // call onMessage
  await listener.onMessage(data, msg)

  // Assertions
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
  expect(ticket!.version).toEqual(data.version)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call onMessage
  await listener.onMessage(data, msg)

  // Assertions
  expect(msg.ack).toHaveBeenCalled()
})

it('does not ack if event is out of order (wrong version number)', async () => {
  const { listener, data, msg } = await setup()

  data.version = 5
  try {
    await listener.onMessage(data, msg)
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled()
})

it('', async () => {})
