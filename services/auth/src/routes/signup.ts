import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { RequestValidationError, BadRequestError } from '../errors'
import { User } from '../models'

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
  async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      /* Instead of returning a response object with a status 400
        throw an error to force it being caught
        by the error handler middleware

       return res.status(400).send(errors.array())
      */
      throw new RequestValidationError(errors.array())
    }

    let { email, password } = req.body
    // does user with this email already exist in DB
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError('Email already in use')
    }

    // Add user to DB
    const user = User.build({ email, password })
    await user.save()

    // Generate JWT
    // already type guard in start()
    // tell typescript that JWT_KEY is not undefined with !
    const userJwt = jwt.sign({ email, id: user.id }, process.env.JWT_KEY!)

    // Set it on the session
    // to circumvent error triggerred by req.session.jwt = ...
    req.session = { jwt: userJwt }

    res.status(201).send(user)
  }
)

export { router as signupRouter }
