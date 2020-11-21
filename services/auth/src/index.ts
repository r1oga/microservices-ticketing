const express = require('express')
import { router } from './routes'
import { errorHandler } from './middlewares'

const app = express()

app.use([express.json(), router, errorHandler])

app.listen(3000, () => console.log(`Auth service 👂 on port 3000`))
