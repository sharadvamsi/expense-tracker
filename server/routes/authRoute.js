import express from "express";
import {
  getUserDetails,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import { validateLogin, validateRegister } from "../middlewares/auth.js";
import { verifyToken } from "../middlewares/expense.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/user-details", verifyToken, getUserDetails);

export default router;
