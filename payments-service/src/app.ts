import express from 'express';
import { json } from 'body-parser';
import { currentUser } from '@tmticketing/common';
import { errorHandler, NotFoundError } from '@tmticketing/common';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';


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
app.use(createChargeRouter);

app.all('/{*splat}', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };
