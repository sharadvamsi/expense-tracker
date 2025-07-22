import express from "express"
import { verifyToken } from "../middlewares/expense.js";
import { adminViewExpense, changeStatus, getLogs } from "../controllers/adminController.js";
import { validateAdmin } from "../middlewares/admin.js";


const router = express.Router();

router.get("/audit-logs",verifyToken,validateAdmin,getLogs);
router.get("/view-expenses",verifyToken,validateAdmin,adminViewExpense);
router.patch("/change-status/:id",verifyToken,validateAdmin,changeStatus)


export default router;