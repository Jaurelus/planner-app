import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";
const sKey = process.env.MY_SECRET_KEY;
export const validateToken = (req, res, next) => {
  console.log(req.headers);
  const { authtoken } = req.headers;
  let userVerified;
  jwt.verify(authtoken, sKey, (err, decoded) => {
    if (err) {
      //logout
      console.log(AuthToken);
      console.log(sKey);

      return res.status(400).json({ message: "Invalid token" });
    } else if (decoded) {
      next();
    }
  });
};
