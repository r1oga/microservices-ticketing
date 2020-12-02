import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import {
  TicketCreatedListener,
  TicketUpdatedListener,
  ExpirationCompleteListener,
  PaymentCreatedListener
} from './events'

const start = async () => {
  /*
    type guard for env variables
    in start function rather than route file
    so that error is caught right at app start
  */
  const {
    JWT_KEY,
    MONGO_URI,
    NATS_CLUSTER_ID,
    NATS_URL,
    NATS_CLIENT_ID
  } = process.env
  if (!JWT_KEY) throw new Error('JWT_KEY not defined')
  if (!MONGO_URI) throw new Error('MONGO_URI not defined')
  if (!NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID not defined')
  if (!NATS_URL) throw new Error('NATS_URL not defined')
  if (!NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID not defined')

  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL)

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

    // Listeners
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()

    await mongoose.connect(MONGO_URI, {
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
