import express from "express";
import { createGoal, getGoals, editGoal } from "./goalsController.js";

const router = express.Router();

router.post("/", createGoal);
router.get("/", getGoals);
router.put("/:id", editGoal);

export default router;
