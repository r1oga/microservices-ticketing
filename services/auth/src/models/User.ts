import mongoose from 'mongoose'

interface UserAttrs {
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, // not tied to TypeScript
    required: true
  },
  password: { type: String, required: true }
})

/*
  interface that describes the properties
  that a USER MODEL HAS
  required to BUILD a new user
*/
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

/*
  interfaces that describe the properties
  that a USER DOCUMENT HAS
  required for type checking of a USER INSTANCE
*/
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

// build a custom function into a model
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs)
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
