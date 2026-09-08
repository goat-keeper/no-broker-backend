import User from "../models/user.model.js";
import { comparePassword, hashPassword } from "../lib/hash.js";
import { createToken, verifyToken } from "../lib/jwt.js";

export async function registerUser(userData) {
  const user = new User(userData);
  await user.validate();
  user.password = await hashPassword(user.password);
  await user.save();

  return { user: toPublicUser(user), token: createToken(user) };
}

export async function authenticateUser(email, password) {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await comparePassword(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return { user: toPublicUser(user), token: createToken(user) };
}

export function authenticateToken(token) {
  return verifyToken(token);
}

function toPublicUser(user) {
  return {
    id: user._id,
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}