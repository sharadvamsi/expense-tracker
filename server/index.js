import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import expenseRouter from "./routes/expenseRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
//connecting to server
app.listen("5000", () => {
  console.log("Server listening on port number 5000 :)");
});

//connecting to mongodb
const db = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log("Error in db", err));

app.use("/user", authRouter);
app.use("/expenses", expenseRouter);
app.use("/admin", adminRouter);
