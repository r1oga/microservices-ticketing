import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events'

const start = async () => {
  /*
    type guard for env variables
    in start function rather than route file
    so that error is caught right at app start
  */
  const { NATS_CLUSTER_ID, NATS_URL, NATS_CLIENT_ID } = process.env
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

    new OrderCreatedListener(natsWrapper.client).listen()
  } catch (err) {
    console.error(err)
  }
}

start()
