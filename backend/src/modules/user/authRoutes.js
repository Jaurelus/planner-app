import express from "express";
import {
  registerUser,
  editUser,
  loginUser,
  getUser,
  logoutUser,
} from "./authController.js";

import { validateToken } from "../../middleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.patch("/:id", validateToken, editUser);
router.post("/login", loginUser);
router.get("/getUser", validateToken, getUser);
router.post("/logout", logoutUser);

export default router;
