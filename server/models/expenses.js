import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const expenseModel = mongoose.model("expense", expenseSchema);

export default expenseModel;
