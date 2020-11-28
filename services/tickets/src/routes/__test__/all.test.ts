import request from 'supertest'

import { app } from '../../app'

it('can fetch a list of tickets', async () => {
  await Promise.all(
    [
      { title: 'ticket1', price: 10 },
      { title: 'ticket2', price: 5 },
      { title: 'ticket3', price: 6 }
    ].map(async ({ title, price }) => {
      await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({ title, price })
        .expect(201)
    })
  )

  const { body: tickets } = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)
  expect(tickets.length).toEqual(3)
})
