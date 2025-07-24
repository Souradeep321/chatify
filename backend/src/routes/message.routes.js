import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middlewares.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/users").get(protectedRoute,getUsersForSidebar);
router.route("/:id").get(protectedRoute, getMessages);

router.route("/send/:id").post(protectedRoute, upload.single("image"),  sendMessage);

export default router