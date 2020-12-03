import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

import { app } from '../app'

/*
  to tell TypeScript about global signup function,
  augment type definition
*/
declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>
    }
  }
}

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'qwert'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  // clear DB
  let collections
  if (mongoose.connection.db) {
    collections = await mongoose.connection.db.collections()
    for (const collection of collections) {
      await collection.deleteMany({})
    }
  } else {
    collections = await mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany({})
    }
  }
})

// close connection and stop DB
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

/*
  globally scoped function for easier use
  only available in test env
*/
global.signup = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)

  const cookie = response.get('Set-Cookie')
  return cookie
}
