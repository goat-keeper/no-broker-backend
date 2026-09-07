import { authenticateToken } from "../services/auth.service.js";

export function requireAuth(req, res, next) {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.auth = authenticateToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function getToken(req) {
  const authorization = req.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7);
  }

  return parseCookies(req.headers.cookie).accessToken;
}

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader.split(";").filter(Boolean).map((cookie) => {
      const separatorIndex = cookie.indexOf("=");
      const key = cookie.slice(0, separatorIndex).trim();
      const value = cookie.slice(separatorIndex + 1).trim();
      return [key, decodeURIComponent(value)];
    }),
  );
}