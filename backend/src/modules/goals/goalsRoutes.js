import express from "express";
import {
  createGoal,
  getGoals,
  editGoal,
  deleteGoal,
} from "./goalsController.js";
import { validateToken } from "../../middleware.js";

const router = express.Router();

router.post("/", validateToken, createGoal);
router.get("/", validateToken, getGoals);
router.put("/:id", validateToken, editGoal);
router.delete("/:id", validateToken, deleteGoal);

export default router;
