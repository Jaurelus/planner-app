import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: false },
  timeStart: { type: Date, required: true },
  timeEnd: { type: Date, required: true },
  taskCategory: { type: String, required: false },
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
