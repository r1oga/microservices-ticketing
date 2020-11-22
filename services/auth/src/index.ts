import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import { router } from './routes'
import { errorHandler } from './middlewares'
import { NotFoundError } from './errors'

const app = express()

app.use([express.json(), router])
app.all('*', async (req, res) => {
  throw new NotFoundError()
})
app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to auth DB')
  } catch (err) {
    console.error(err)
  }
  app.listen(3000, () => console.log(`Auth service 👂 on port 3000`))
}

start()
