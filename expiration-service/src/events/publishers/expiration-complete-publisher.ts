import { Publisher, Subjects, ExpirationCompletedEvent } from '@tmticketing/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}