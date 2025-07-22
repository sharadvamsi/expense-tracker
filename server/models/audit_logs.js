import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    expenseId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const auditModel = mongoose.model("audit_log", auditSchema);

export default auditModel;
