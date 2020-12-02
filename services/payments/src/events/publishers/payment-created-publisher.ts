import { Publisher, PaymentCreatedEvent, Subjects } from '@r1ogatix/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
