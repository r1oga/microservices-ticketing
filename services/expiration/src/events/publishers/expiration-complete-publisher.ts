import { Publisher, Subjects, ExpirationCompleteEvent } from '@r1ogatix/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
