import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';
import path from 'path';

import oauthRoutes from './routes/oauth.route.js';
import userRoutes from './routes/user.route.js';
import tweetRoutes from './routes/posts.route.js';
import notificationRoutes from './routes/notification.route.js';

import db from './config/db.js';


config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT;

const app = express();

const __dirname = path.resolve();

//Input parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

//use routes
app.use('/api/oauth', oauthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', tweetRoutes);
app.use('/api/notification', notificationRoutes);


if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
}

app.listen(PORT, async () => {
  const {success,message} = await db.connectDb();
  console.log(`Success: ${success}, message: ${message}`);
  console.log(`Server started on http://localhost:${PORT}`);
})