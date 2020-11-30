import { Publisher, Subjects, OrderCancelledEvent } from '@r1ogatix/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
