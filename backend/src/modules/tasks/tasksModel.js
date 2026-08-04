import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userID: { type: String, required: true, immutable: true },
  taskName: { type: String, required: true },
  taskDescription: { type: String },
  timeStart: { type: Date, required: true },
  timeEnd: { type: Date, required: true },
  taskCategory: { type: String },
  remindTime: { type: Date },
  notfiedAt: { type: Date, default: null },
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
