import express from 'express';
import { json } from 'body-parser';
import { currentUser } from '@tmticketing/common'
import { errorHandler, NotFoundError } from '@tmticketing/common';
import cookieSession from 'cookie-session';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';

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

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('/{*splat}', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };
