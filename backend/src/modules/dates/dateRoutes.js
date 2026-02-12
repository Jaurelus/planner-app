import express from "express";
import { validateToken } from "../../middleware.js";

import { addNewDate, getDates } from "./dateController.js";

const router = express.Router();
router.post("/", validateToken, addNewDate);
router.get("/", validateToken, getDates);

export default router;
