import express from "express";
import {
  editTask,
  deleteTask,
  addTask,
  viewAllTasks,
} from "./tasksController.js";
import { validateToken } from "../../middleware.js";
const router = express.Router();

router.post("/", validateToken, addTask);
router.delete("/:id", validateToken, deleteTask);
router.put("/:id", validateToken, editTask);
router.get("/", validateToken, viewAllTasks);

export default router;
