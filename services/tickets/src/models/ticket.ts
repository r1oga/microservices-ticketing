import mongoose from 'mongoose'

interface TicketAttrs {
  title: string
  price: number
  userId: string
}

/*
  interfaces that describe the properties
  that a Ticket DOCUMENT HAS
  required for type checking of a Ticket INSTANCE
*/
interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
}

/*
  interface that describes the properties
  that a TICKET MODEL HAS
  required to BUILD a new ticket
*/
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: { type: Number, required: true },
    userId: { type: String, required: true }
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

// build a custom function into a model
ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs)
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
