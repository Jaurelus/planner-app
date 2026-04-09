import {
  createLinkToken,
  exchangeToken,
  getTransactions,
  getRecurringTransactions,
} from "../plaid/plaidController.js";
import { validateToken } from "../../middleware.js";
import express from "express";

const router = express.Router();
router.post("/createToken", validateToken, createLinkToken);
router.post("/exchangeToken", validateToken, exchangeToken);
router.post("/getTransactions", validateToken, getTransactions);
router.get(
  "/getRecurringTransactions",
  validateToken,
  getRecurringTransactions,
);

export default router;
