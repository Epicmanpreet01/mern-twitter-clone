import express from 'express';
import { protectedRoutes } from '../middlewares/oauth.middleware.js';
import { createPost, deletePost, likePost, commentOnPost, getPosts, getLikedPosts, getFollowingPosts, getUserPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.get('/all', protectedRoutes, getPosts);
router.get('/liked/:userName', protectedRoutes, getLikedPosts);
router.get('/following', protectedRoutes, getFollowingPosts);
router.get('/user/:userName', protectedRoutes, getUserPosts);
router.post('/create', protectedRoutes, createPost);
router.post('/like/:id', protectedRoutes, likePost);
router.post('/comment/:id', protectedRoutes, commentOnPost);
router.delete('/delete/:id', protectedRoutes, deletePost);

export default router;