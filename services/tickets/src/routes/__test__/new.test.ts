import request from 'supertest'
import { app } from '../../app'

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
    .send({})
    .expect(200)
})

it('returns an error if an invalid title is provided', async () => {
  const response = await request(app).post('/api/tickets').send({})
})

it('returns an error if an invalid price is provided', async () => {})

it('creates a ticked if valid inputs are provided', async () => {})
