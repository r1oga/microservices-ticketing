import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', () =>
  request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.co', password: 'password' })
    .expect(201))
