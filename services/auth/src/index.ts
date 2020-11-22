const express = require('express')
import { router } from './routes'
import { errorHandler } from './middlewares'
import { NotFoundError } from './errors'

const app = express()

app.use([express.json(), router])
app.all('*', () => {
  throw new NotFoundError()
})
app.use(errorHandler)

app.listen(3000, () => console.log(`Auth service 👂 on port 3000`))
