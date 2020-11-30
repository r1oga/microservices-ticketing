import { Ticket, TicketAttrs } from '../models'

export default async (attrs: TicketAttrs = { title: 'concert', price: 20 }) => {
  const ticket = Ticket.build(attrs)
  await ticket.save()
  return ticket
}
