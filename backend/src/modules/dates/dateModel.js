import mongoose from "mongoose";

const COLORS = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#EAB308", // yellow
  "#A855F7", // purple
  "#F97316", // orange
  "#14B8A6", // teal
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

const DateModel = mongoose.Schema({
  userID: { type: String, required: true },
  date: { type: Date, required: true },
  name: { type: String, required: true },
  type: { type: String, default: "" },
  rule: { type: String, default: "" },
  color: { type: String, default: getRandomColor() },
});

const MarkedDate = mongoose.model("MarkedDate", DateModel);

export default MarkedDate;
