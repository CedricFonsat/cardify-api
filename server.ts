import express from 'express';
import mongoose from 'mongoose';
import bp from 'body-parser';

import cors from 'cors';
import { APP_URL, CORS_ORIGIN, MONGODB_URI, PORT } from './config';
import { authRouter } from './src/routes/auth-router';
import { cardRouter } from './src/routes/card-router';
import { userRouter } from './src/routes/user-router';

const app = express();
const port = PORT;
const db = MONGODB_URI;

const corsOptions = {
    origin: CORS_ORIGIN,
    credentials: true,
};
app.use(bp.json());
app.use(cors(corsOptions));

mongoose.connect(db)
.then(() => console.log('Connexion réussie à la base de données'))
.catch((err) => console.error('Erreur de connexion à la base de données', err));


app.use('/api/auth', authRouter);
app.use('/api/card', cardRouter);
app.use('/api/user', userRouter);

console.log('rrr');


app.listen(port, () => {
    console.log(`Server is running on ${APP_URL}`);   
})