import mongoose from "mongoose";

const objective = new mongoose.Schema({
  userID: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  progress: { type: Number, default: 0 },
  goalNumber: { type: Number, default: 0 },
  month: { type: Number, required: true },
});

const Objectives = mongoose.model("Objective", objective);
export default Objective;
