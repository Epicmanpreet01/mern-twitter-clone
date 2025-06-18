import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';

import oauthRoutes from './routes/oauth.routes.js';
import userRoutes from './routes/user.routers.js';

import db from './config/db.js';
config()
const PORT = process.env.PORT;

const app = express();

//Input parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//use routes
app.use('/api/oauth', oauthRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req,res) => {
  res.status(200).send('Hello to root')
})

app.listen(PORT, async () => {
  const {success,message} = await db.connectDb();
  console.log(`Success: ${success}, message: ${message}`);
  console.log(`Server started on http://localhost:${PORT}`);
})