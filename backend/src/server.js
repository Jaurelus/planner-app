//Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import goalsRoutes from "./goalsRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware (Every request passes through )
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/goals", goalsRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
