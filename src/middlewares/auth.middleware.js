import { verifyAccessToken } from "../lib/jwt.js";

const getAccessToken = (req) => {
const authHeader = req.headers.authorization;

if (authHeader?.startsWith("Bearer ")) {
return authHeader.split(" ")[1];
}

const cookies =
req.headers.cookie?.split(";").map((cookie) => cookie.trim()) ?? [];

const accessTokenCookie = cookies.find((cookie) =>
cookie.startsWith("accessToken=")
);

return accessTokenCookie?.split("=")[1];
};

export const protectedRoute = (req, res, next) => {
try {
const accessToken = getAccessToken(req);

if (!accessToken) {
  return res.status(401).json({
    message: "No token provided",
  });
}

const decoded = verifyAccessToken(accessToken);

req.user = decoded;

next();

} catch (err) {
console.error("Auth middleware error:", err);

return res.status(401).json({
  message: "Invalid or expired token",
});

}
};
