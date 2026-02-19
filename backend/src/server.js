//Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import Holidays from "date-holidays";

import goalsRoutes from "./modules/goals/goalsRoutes.js";
import tasksRoutes from "./modules/tasks/tasksRoutes.js";
import authRoutes from "./modules/user/authRoutes.js";
import dateRoutes from "./modules/dates/dateRoutes.js";
import objectRoutes from "./modules/objectives/ObjectiveRoutes.js";

var hd = new Holidays("US");
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware (Every request passes through )
app.use(cors());
app.use(express.json());

app.get("/api/holidays", (req, res) => {
  try {
    const country = "US";
    let countryHolidays = new Holidays(country);
    let yearCountryHolidays = countryHolidays.getHolidays();
    return res.status(200).json({
      message: "Holidays successfully retrieved",
      holidays: yearCountryHolidays,
    });
  } catch (error) {
    return res.status(400).json({ message: "Error", error });
  }
});

//Routes
app.use("/api/goals", goalsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/user", authRoutes);
app.use("/api/dates", dateRoutes);
app.use("/api/objectives", objectRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`\x1b[32m`, `Server running on http://localhost:${PORT}`);
});
