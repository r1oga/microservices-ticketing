const { Router } = require('express')

const router = Router()

router.get('/api/users/currentUser', (_, res) =>
  res.status(200).send('Hi There')
)

export { router }
