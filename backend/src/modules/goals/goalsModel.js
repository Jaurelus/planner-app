import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  complete: { type: Boolean, default: false },
  date: { type: Date, default: new Date() },
});

const Goal = mongoose.model("Goal", GoalSchema);

export default Goal;
