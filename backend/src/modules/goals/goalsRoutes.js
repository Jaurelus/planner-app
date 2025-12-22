import express from "express";
import {
  createGoal,
  getGoals,
  editGoal,
  deleteGoal,
} from "./goalsController.js";

const router = express.Router();

router.post("/", createGoal);
router.get("/", getGoals);
router.put("/:id", editGoal);
router.delete("/:id", deleteGoal);

export default router;
