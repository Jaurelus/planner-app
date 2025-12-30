//Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import mongoose from "mongoose";

import goalsRoutes from "./modules/goals/goalsRoutes.js";
import tasksRoutes from "./modules/tasks/tasksRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware (Every request passes through )
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/goals", goalsRoutes);
app.use("/api/tasks", tasksRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`\x1b[32m`, `Server running on http://localhost:${PORT}`);
});
