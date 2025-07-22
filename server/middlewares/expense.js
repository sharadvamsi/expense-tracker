import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.id;
    next();
  } catch (error) {
    console.log("err", error);
    return res.status(401).json({ err: error.message });
  }
};

export const getUserId = (req, res, next) => {
  try {
    const { amount, date, notes, category } = req.body;
    if (!amount) return res.status(400).json({ err: "amount is required" });
    if (!date) return res.status(400).json({ err: "date is required" });
    if (!notes) return res.status(400).json({ err: "notes is required" });
    if (!category) return res.status(400).json({ err: "category is required" });
    next();
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ err: "Internal server error" });
  }
};
