import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const user = newUser.toObject();
    delete user.password;
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    if (error.code === 11000)
      res.status(409).json({ err: "Email already exists" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const encryptedPassword = req.user.password;
    const passwordcheck = await bcrypt.compare(password, encryptedPassword);
    if (!passwordcheck)
      return res.status(400).json({ err: "Invalid credentials" });
    const payload = {
      id: req.user._id,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Internal server error" });
  }
};
