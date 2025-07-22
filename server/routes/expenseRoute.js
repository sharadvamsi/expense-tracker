import express from "express";
import { addExpense, viewExpense } from "../controllers/expenseController.js";
import { getUserId, verifyToken } from "../middlewares/expense.js";
const router = express.Router();

router.post("/add-expense", verifyToken, getUserId, addExpense);
router.get("/view-expenses", verifyToken, viewExpense);

export default router;
