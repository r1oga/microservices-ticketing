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
    .send({ title: 'a', price: 10 })
    .expect(200)
})
