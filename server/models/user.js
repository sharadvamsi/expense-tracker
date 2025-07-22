import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    role:{
      type:String,
      default: "employee"
    }
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
