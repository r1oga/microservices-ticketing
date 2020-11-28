import { Express } from 'express'
import request from 'supertest'

export default (app: Express) => (ticket: { title?: any; price?: any }) => {
  const { title, price } = ticket
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title, price })
}
