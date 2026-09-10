import { Router } from "express";
import {
  login,
  logout,
  signup,
  getCurrentUser,
  completeProfile,
} from "../controllers/auth.controller.js";
import { asyncHandler } from "../lib/Asynchandler.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const authRouter = Router();

authRouter.post("/signup", asyncHandler(signup));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", logout);
authRouter.get("/me", protectRoute, asyncHandler(getCurrentUser));
authRouter.put(
  "/complete-profile",
  protectRoute,
  upload.single("profileImage"),
  asyncHandler(completeProfile)
);

export default authRouter;