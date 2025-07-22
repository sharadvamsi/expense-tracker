import express from "express";
import { verifyToken } from "../middlewares/expense.js";
import {
  adminViewExpense,
  changeStatus,
  expenseByCategory,
  expenseByMonth,
  getLogs,
} from "../controllers/adminController.js";
import { validateAdmin } from "../middlewares/admin.js";

const router = express.Router();

router.get("/audit-logs", verifyToken, validateAdmin, getLogs);
router.get("/view-expenses", verifyToken, validateAdmin, adminViewExpense);
router.patch("/change-status/:id", verifyToken, validateAdmin, changeStatus);
router.get(
  "/expense-by-category",
  verifyToken,
  validateAdmin,
  expenseByCategory
);
router.get("/expense-by-month", verifyToken, validateAdmin, expenseByMonth);

export default router;
