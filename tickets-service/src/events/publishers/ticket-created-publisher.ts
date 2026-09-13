import { Publisher, Subjects, TicketCreatedEvent } from '@tmticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}