import { Publisher, Subjects, TicketUpdatedEvent } from '@tmticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

