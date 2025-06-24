import express from "express";
import {
  getUserProfile,
  followUnfollowUser,
  updateProfile,
  getSuggestedUsers,
} from "../controllers/user.controllers.js";
import { protectedRoutes } from "../middlewares/oauth.middleware.js";
const router = express.Router();

router.get("/profile/:userName", protectedRoutes, getUserProfile);
router.get("/suggestion", protectedRoutes, getSuggestedUsers);
router.post("/follow/:id", protectedRoutes, followUnfollowUser);
router.post("/update", protectedRoutes, updateProfile);

export default router;
