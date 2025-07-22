import auditModel from "../models/audit_logs.js";
import expenseModel from "../models/expenses.js";
import userModel from "../models/user.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await auditModel.find();
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ err: "Internal server error" });
  }
};

export const adminViewExpense = async (req, res) => {
  try {
    const { userId, status } = req.query;
    const filter = {};

    if (userId) {
      filter.userId = userId;
    }

    if (status) {
      filter.status = status;
    }

    const getRecords = await expenseModel.find(filter);
    return res.status(200).json(getRecords);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ err: "Internal server error" });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { status } = req.body;

    const updateStatus = await expenseModel.findByIdAndUpdate(
      expenseId,
      { status },
      { new: true }
    );
    const auditLog = await auditModel.create({
      action: "status changed",
      userId: req.userId,
      expenseId,
    });
    return res.status(200).json(updateStatus);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ err: "Internal server error" });
  }
};

export const expenseByCategory = async (req, res) => {
  const chartData = await expenseModel.aggregate([
    { $match: { status: "Approved" } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        category: "$_id",
        total: { $round: ["$total", 2] },
        _id: 0,
      },
    },
  ]);

  res.status(200).json(chartData);
};

export const expenseByMonth = async (req, res) => {
  const monthlyExpenses = await expenseModel.aggregate([
    {
      $match: { status: "Approved" },
    },
    {
      $addFields: {
        dateObj: { $toDate: "$date" }, // Converts string to actual Date
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$dateObj" },
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        month: "$_id",
        total: { $round: ["$total", 2] },
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  res.status(200).json(monthlyExpenses);
};
