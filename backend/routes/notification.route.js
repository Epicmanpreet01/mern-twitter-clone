import express from "express";
import { protectedRoutes } from "../middlewares/oauth.middleware.js";

import {
  getNotifications,
  deleteNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectedRoutes, getNotifications);
router.delete("/", protectedRoutes, deleteNotifications);
router.delete("/:id", protectedRoutes, deleteNotification);

export default router;
