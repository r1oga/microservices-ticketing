import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

import { app } from '../app'

/*
  to tell TypeScript about global signup function,
  augment type definition
*/
declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[]
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
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
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
global.signup = () => {
  /*
    Create fake cookie
    Decoded on
    https://www.base64decode.org/
  */
  // Build a JWT payload & create the JWT
  const token = jwt.sign(
    { email: 'r1oga@test.com', id: 1 },
    process.env.JWT_KEY!
  )

  // Build session Object as JSON
  const sessionJSON = JSON.stringify({ jwt: token })

  // Encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`express:sess=${base64}`] // as array for supertest
}
