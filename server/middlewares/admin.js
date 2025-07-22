import userModel from "../models/user.js";

export const validateAdmin = async (req, res, next) => {
  const adminId = req.userId;
  const validateUser = await userModel.findById(adminId);
  if (validateUser.role !== "admin")
    return res
      .status(401)
      .json({ err: "you dont have access.please contact admin" });
  next();
};
