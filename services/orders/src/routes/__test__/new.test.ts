import request from 'supertest'

import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket, Order, OrderStatus } from '../../models'
import { fakeId } from '../../lib'

it('returns an error if the ticket does not exist', async () => {
  const ticketId = fakeId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  // create ticket
  const ticket = Ticket.build({ title: 'concert', price: 20 })
  await ticket.save()

  // create order
  const order = Order.build({
    ticket,
    userId: '123',
    status: OrderStatus.Created,
    expiresAt: new Date()
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({ title: 'concert', price: 20 })
  await ticket.save()

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201)

  const {
    status,
    id: orderId,
    ticket: { title, price, id: ticketId }
  } = response.body
  const order = await Order.findById(orderId)
  expect(order).not.toBeNull()
  if (!order) throw new Error()

  expect(status).toEqual('created')
  expect(ticket.title).toEqual(title)
  expect(ticket.price).toEqual(price)
  expect(ticket.id).toEqual(ticketId)
})
