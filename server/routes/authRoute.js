import express from "express"
import { loginUser, registerUser } from "../controllers/authController.js";
import { validateLogin, validateRegister } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register",validateRegister,registerUser);
router.post("/login",validateLogin,loginUser);

export default router;