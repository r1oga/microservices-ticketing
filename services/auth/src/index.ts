const express = require('express')
import { router } from './routes'
import { middlewares } from './middlewares'

const app = express()

app.use(middlewares)
app.use(router)

app.listen(3000, () => console.log(`Auth service 👂 on port 3000`))
