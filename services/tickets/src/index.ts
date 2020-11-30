import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'

const start = async () => {
  /*
    type guard for process.env.JWT_KEY
    in start function rather than route file
    so that error is caught right at app start
  */
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not defined')
  }

  try {
    await natsWrapper.connect('ticketing', '123', 'http://nats-srv:4222')

    /*
      handle connection close
      as we call process.exit(), better not to hide it in
      an other file and make it visible in index entry file
    */
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close()) // interrupt signal
    process.on('SIGTERM', () => natsWrapper.client.close()) // terminate signal (ctrl+c)

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to tickets DB')
  } catch (err) {
    console.error(err)
  }
  app.listen(3000, () => console.log(`Tickets service 👂 on port 3000`))
}

start()
