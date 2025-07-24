import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";
import { avatarUpload, checkAuth, login, logout, refreshAccessToken, register } from "../controllers/auth.controllers.js";

const router = Router();

router.route("/signup").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/check").get(protectedRoute, checkAuth);
router.route("/avatar").patch(protectedRoute, upload.single("avatar"), avatarUpload);

router.route("/refresh-token").post(refreshAccessToken);

export default router