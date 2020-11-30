import request from 'supertest'

import { app } from '../../app'
import { createTicket } from '../../lib'

it('fetches all orders for a particular user', async () => {
  // // create 3 tickets
  const [ticketOne, ticketTwo, ticketThree] = await Promise.all(
    [
      { title: 'ticket1', price: 10 },
      { title: 'ticket2', price: 5 },
      { title: 'ticket3', price: 6 }
    ].map(async ({ title, price }) => createTicket({ title, price }))
  )

  const userOne = global.signup()
  const userTwo = global.signup()

  // create 1 order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })

  // create 2 orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })

  // fetch User #2 orders
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200)
  const orders = response.body

  expect(orders.length).toEqual(2)
  expect(orders[0].id).toEqual(orderOne.id)
  expect(orders[1].id).toEqual(orderTwo.id)
  expect(orders[0].ticket.title).toEqual(ticketTwo.title)
  expect(orders[1].ticket.title).toEqual(ticketThree.title)
})

it('returns 401 if user is not authenticated', async () => {
  const ticket = await createTicket()
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app).get('/api/orders').send().expect(401)
})
