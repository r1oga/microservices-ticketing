import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models'

it('has a route handler listening to /api/tickets for posts requests', async () => {
  const response = await request(app).post('/api/tickets').send({})
  expect(response.status).not.toEqual(404)
})

it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401)

  const cookie = global.signup()
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'a', price: 10 })
    .expect(201)
})

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: '', price: 10 })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'Test', price: 'invalid' })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'Test', price: -1 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'Test' })
    .expect(400)
})

it('creates a ticket if valid inputs are provided', async () => {
  expect((await Ticket.find({})).length).toEqual(0)

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'test', price: 5 })
    .expect(201)

  const { title, price, userId } = response.body

  expect(title).toEqual('test')
  expect(price).toEqual(5)
  expect(userId).toEqual('1')
  expect((await Ticket.find({})).length).toEqual(1)
})
