import { Router } from 'express'

const router = Router()

router.get('/api/users/currentUser', (_, res) =>
  res.status(200).send('Hello world')
)

router.post('/api/users/currentUser', (_, res) =>
  res.status(200).send('Hello world post')
)

export { router as currentUserRouter }
