import auditModel from "../models/audit_logs.js";
import expenseModel from "../models/expenses.js";

export const addExpense = async (req, res) => {
  try {
    const { amount, date, notes, category } = req.body;

    const expenseRecord = await expenseModel.create({
      userId: req.userId,
      amount,
      date,
      notes,
      category,
    });
    const expenseId = expenseRecord._id.toString();

    const auditLog = await auditModel.create({
      action: "Expense created",
      userId: req.userId,
      expenseId,
    });

    res.status(201).json(expenseRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Internal Server error" });
  }
};

export const viewExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const getRecords = await expenseModel.find({ userId });
    res.status(200).json(getRecords);
  } catch (error) {
    console.log("err", error);
    res.status(500).json({ err: "Internal server error" });
  }
};
