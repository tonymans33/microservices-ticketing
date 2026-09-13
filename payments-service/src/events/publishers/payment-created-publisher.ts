import { Publisher, Subjects, PaymentCreatedEvent } from '@tmticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}