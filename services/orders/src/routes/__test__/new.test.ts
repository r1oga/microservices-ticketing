import request from 'supertest'

import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models'
import { CreateTicket, fakeId } from '../../lib'
const createTicket = CreateTicket(app)

it('returns an error if the ticket does not exist', async () => {
  const ticketId = fakeId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {})

it('reserves a ticket', async () => {})
