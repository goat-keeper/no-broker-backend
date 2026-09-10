import {
  authenticateUser,
  registerUser,
  getMe,
  completeUser,
  uploadToCloudinary,
} from "../services/auth.service.js";
import { ENV } from "../config/env.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: ENV.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function signup(req, res) {
  const { username, fullname, email, password } = req.body;
  const result = await registerUser({ username, fullname, email, password });

  res.cookie("accessToken", result.token, cookieOptions);
  return res.status(201).json({ user: result.user });
}

export async function login(req, res) {
  const { email, password } = req.body;
  
  const result = await authenticateUser(email, password);

  res.cookie("accessToken", result.token, cookieOptions);
  return res.status(200).json({ user: result.user });
}

export function logout(req, res) {
  res.clearCookie("accessToken", cookieOptions);
  return res.status(204).send();
}
export async function completeProfile(req, res) {
  const { phone, address } = req.body;
  const id = req.user.userId;

  if (!phone || !address) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "Profile image is required"
    });
  }

  const profileUrl = await uploadToCloudinary(req.file.path);

  const completeResponse = await completeUser(
    id,
    phone,
    address,
    profileUrl
  );

  return res.status(200).json({
    user: completeResponse
  });
}
export async function getCurrentUser(req,res) {
  const user = req.user;
  const currUser = await  getMe(user)
  return res.status(200).json({user:currUser})
}