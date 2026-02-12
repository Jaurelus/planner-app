import express from "express";
import {
  registerUser,
  editUser,
  sendVerification,
  validateUser,
  loginUser,
} from "./authController.js";

import { validateToken } from "../../middleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.patch("/:id", validateToken, editUser);
router.post("/login", loginUser);
router.post("/send", sendVerification);
router.post("/verify", validateUser);

export default router;
