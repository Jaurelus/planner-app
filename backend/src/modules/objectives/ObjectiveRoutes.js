import express from "express";

import { validateToken } from "../../middleware.js";
import {
  addObjective,
  getObjectives,
  editObjective,
  deleteObjective,
} from "../objectives/objectivesController.js";

const router = express.Router();
router.post("/", validateToken, addObjective);
router.get("/", validateToken, getObjectives);
router.patch("/:objectiveID", validateToken, editObjective);
router.delete("/:objectiveID", validateToken, deleteObjective);

export default router;
