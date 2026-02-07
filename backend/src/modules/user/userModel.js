import mongoose, { Schema } from "mongoose";
import Goal from "../goals/goalsModel.js";
import Task from "../tasks/tasksModel.js";

const UserModel = new mongoose.Schema({
  email: { type: String, require: true },
  phoneNumber: { type: String },
  password: { type: String, require: true },
  firstName: { type: String, require: true, default: "" },
  lastName: { type: String },
  userGoals: [{ type: Schema.Types.ObjectId, ref: "Goal" }],
  userTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  isVerified: { type: Boolean, default: false },
  verficationToken: { type: String, require: true },
  //userNotes
  //userMarkedDates
});

const User = mongoose.model("User", UserModel);

export default User;
