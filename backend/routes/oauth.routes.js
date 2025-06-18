import express from 'express';
import { signUp, logIn, logOut, getCurrUser } from '../controllers/oauth.controller.js';
import { protectedRoutes } from '../middlewares/oauth.middleware.js';

const router = express.Router();

router.get('/me', protectedRoutes, getCurrUser);
router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', logOut);

export default router;