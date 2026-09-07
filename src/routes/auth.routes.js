import { Router } from "express";
import {
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { asyncHandler } from "../middlewares/async.handler.js";

const authRouter = Router();

authRouter.post("/signup", asyncHandler(signup));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", logout);

export default authRouter;