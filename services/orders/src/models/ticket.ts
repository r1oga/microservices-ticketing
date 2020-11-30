import mongoose from 'mongoose'

import { Order, OrderStatus } from './order'

/*
  Looks like duplicated code (tickets service)
  But DONT PUT it in common package
  This code is specific to orders
*/
export interface TicketAttrs {
  title: string
  price: number
}

/*
  interfaces that describe the properties
  that a Ticket DOCUMENT HAS
  required for type checking of a Ticket INSTANCE
*/
export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  isReserved(): Promise<boolean>
}

/*
  interface that describes the properties
  that a Ticket MODEL HAS
  required to BUILD a new Ticket
*/
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const TicketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }
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
TicketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs)
TicketSchema.methods.isReserved = async function () {
  // this === the ticket doc we just called `isReserved` on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema)

export { Ticket }
