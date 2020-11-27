import express from 'express'
import 'express-async-errors'

// import { router } from './routes'
import { errorHandler, middlewares, NotFoundError } from '@r1ogatix/common'

const app = express()

/* 
  traffic is being proxied by ingress nginx
  instruct express to trust it
*/
app.set('trust proxy', true)

app.use([...middlewares])

app.all('*', async (req, res) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
