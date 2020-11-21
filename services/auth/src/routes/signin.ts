import { Router } from 'express'

const router = Router()

router.post('/api/users/signin', (_, res) =>
  res.status(200).send('Hello world')
)

export { router as signinRouter }
