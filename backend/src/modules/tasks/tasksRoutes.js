import express from "express";
import {
  editTask,
  deleteTask,
  addTask,
  viewAllTasks,
} from "./tasksController.js";

const router = express.Router();

router.post("/", addTask);
router.delete("/:id", deleteTask);
router.put("/:id", editTask);
router.get("/", viewAllTasks);

export default router;
