import express from "express";
import { validateToken } from "../../middleware.js";

import {
  addNewDate,
  getDates,
  getCategories,
  editDate,
  deleteDate,
} from "./dateController.js";

const router = express.Router();
router.post("/", validateToken, addNewDate);
router.get("/", validateToken, getDates);
router.get("/categories", validateToken, getCategories);
// ":dateID" placeholder is what fills req.params.dateID in the controllers
router.patch("/:dateID", validateToken, editDate);
router.delete("/:dateID", validateToken, deleteDate);

export default router;
