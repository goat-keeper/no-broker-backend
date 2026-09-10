import { verifyAccessToken } from "../lib/jwt.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No access token provided" });
    }

    req.user = verifyAccessToken(accessToken);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid access token" });
  }
};