import { Publisher, OrderCancelledEvent, Subjects } from '@r1ogatix/common'

export class ChargeCompletedPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
