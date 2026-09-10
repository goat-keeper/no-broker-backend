import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const signAccessToken = (payload) => {
return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, {
expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN,
});
};

export const verifyAccessToken = (token) => {
return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
};
