import express from 'express'
const router = require('./routes')
const middlewares = require('./middlewares')


const app = express()

app.use(middlewares)
app.use(router)

app.listen(3000, () => console.log(`Auth service 👂 on port 3000!`))