import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";
const sKey = process.env.MY_SECRET_KEY;
export const validateToken = (req, res, next) => {
  const { authtoken } = req.headers;
  jwt.verify(authtoken, sKey, (err, decoded) => {
    if (err) {
      //logout
      // 401, not 400 -- lets the client tell "session expired" apart from
      // "you sent a bad payload", which every other 400 here means.
      return res.status(401).json({ message: "Invalid token" });
    } else if (decoded) {
      // The id comes from the signed token, never from a client header
      req.userID = decoded.id;
      next();
    }
  });
};
