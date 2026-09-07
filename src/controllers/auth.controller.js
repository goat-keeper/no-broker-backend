import {
  authenticateUser,
  registerUser,
} from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
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