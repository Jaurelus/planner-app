import express from "express";

import { validateToken } from "../../middleware.js";
import {
  addObjective,
  getObjectives,
  editObjective,
  deleteObjective,
} from "../objectives/objectivesController.js";

const router = express.router();
router.post("/", validateToken, addObjective);
router.get("/", validateToken, getObjectives);
router.patch("/", validateToken, editObjective);
router.delete("/", validateToken, deleteObjective);

export default router;
