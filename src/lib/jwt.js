import jwt from "jsonwebtoken";

export const signAccessToken = (payload) => {
return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
});
};

export const verifyAccessToken = (token) => {
return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
