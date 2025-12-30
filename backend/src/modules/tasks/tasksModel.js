import mongoose from "mongoose";

const TaskSchema = new mongoose({
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: false },
  timeStart: { type: Number, required: true },
  timeEnd: { type: Number, required: true },
  taskCategory: { type: String, required: false },
});

const Task = mongoose.Schema("Task", TaskSchema);

export default Task;
