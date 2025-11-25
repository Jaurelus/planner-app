import express from "express";
import Goal from "./goalsModel";
import { createGoal, getGoals } from "./goalsController";

const router = express.Router();

router.post("/", createGoal);
router.get("/", getGoals);

export default router;
