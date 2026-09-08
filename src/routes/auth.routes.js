import { Router } from "express";
import {
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { asyncHandler } from "../lib/Asynchandler.js";

const authRouter = Router();

authRouter.post("/signup", asyncHandler(signup));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", logout);

export default authRouter;