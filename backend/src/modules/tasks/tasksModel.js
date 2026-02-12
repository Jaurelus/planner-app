import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userID: { type: String, require: true, immutable: true },
  taskName: { type: String, required: true },
  taskDescription: { type: String },
  timeStart: { type: Date, required: true },
  timeEnd: { type: Date, required: true },
  taskCategory: { type: String },
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
