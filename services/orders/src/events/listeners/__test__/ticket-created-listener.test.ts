import { TicketCreatedEvent } from '@r1ogatix/common'
import { Message } from 'node-nats-streaming'

import { fakeId } from '../../../lib'
import { Ticket } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedListener } from '../ticket-created-listener'

const setup = async () => {
  // instantiate a listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // Fake an event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: fakeId(),
    title: 'concert',
    price: 10,
    userId: fakeId()
  }

  // Fake a msg
  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()

  // call onMessage
  await listener.onMessage(data, msg)

  // Assertions
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call onMessage
  await listener.onMessage(data, msg)

  // Assertions
  expect(msg.ack).toHaveBeenCalled()
})
