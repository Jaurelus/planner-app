import express from "express";
import { registerUser } from "./authController.js";
const router = express.Router();

router.post("/", registerUser);

export default router;
