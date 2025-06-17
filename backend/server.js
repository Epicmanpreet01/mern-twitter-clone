import express from 'express';
import { config } from 'dotenv';


import db from './config/db.js';
import oauthRoutes from './routes/oauth.routes.js';

config()
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use('/api/oauth', oauthRoutes);

app.get('/', (req,res) => {
  res.status(200).send('Hello to root')
})

app.listen(PORT, async () => {
  const {success,message} = await db.connectDb();
  console.log(`Success: ${success}, message: ${message}`);
  console.log(`Server started on http://localhost:${PORT}`);
})