import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
  try {
    /*
      type guard for process.env.JWT_KEY
      in start function rather than route file
      so that error is caught right at app start
    */
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY not defined')
    }

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
