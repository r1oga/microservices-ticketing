import { Publisher, Subjects, OrderCreatedEvent } from '@r1ogatix/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
