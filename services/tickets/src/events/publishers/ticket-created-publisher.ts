import { Publisher, Subjects, TicketCreatedEvent } from '@r1ogatix/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
