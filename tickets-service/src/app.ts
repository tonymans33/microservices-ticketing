import express from 'express';
import { json } from 'body-parser';
import { currentUser } from '@tmticketing/common';
import { errorHandler, NotFoundError } from '@tmticketing/common';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);

app.use(json());

app.use(cookieSession({
    signed: false,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
}))

app.use(currentUser);

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all('/{*splat}', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };
