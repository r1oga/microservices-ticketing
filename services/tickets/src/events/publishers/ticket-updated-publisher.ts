import { Publisher, Subjects, TicketUpdatedEvent } from '@r1ogatix/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
