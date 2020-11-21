import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

const router = Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      /* Instead of returning a response object with a status 400
        throw an error to force it being caught
        by the error handler middleware
        
       return res.status(400).send(errors.array())
      */
      throw new Error('Invalid email or password')
    }

    const { email, password } = req.body
    console.log('Creating a new user...')
    throw new Error('error connecting to DB')
    res.status(200).send({})
  }
)

export { router as signupRouter }
