import mongoose from "mongoose";

const COLORS = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#EAB308", // yellow
  "#A855F7", // purple
  "#F97316", // orange
  "#14B8A6", // teal
];

const DateModel = mongoose.Schema({
  userID: { type: String, required: true },
  date: { type: Date, required: true },
  name: { type: String, required: true },
  rule: { type: String, default: "" },
  category: {
    type: { type: String, default: "" },
    color: { type: String, default: "" },
  },
});

const MarkedDate = mongoose.model("MarkedDate", DateModel);

export default MarkedDate;
