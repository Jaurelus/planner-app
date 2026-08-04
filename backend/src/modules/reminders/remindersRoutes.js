import express from "express";
import { validateToken } from "../../middleware.js";
import {
  getReminders,
  editReminder,
  createReminder,
  deleteReminder,
} from "./remindersControllers.js";
const router = express.Router();

router.post("/", validateToken, createReminder);
router.get("/", validateToken, getReminders);
// ":reminderID" fills req.params.reminderID (same convention as tasks/objectives)
router.patch("/:reminderID", validateToken, editReminder);
router.delete("/:reminderID", validateToken, deleteReminder);

export default router;
