import mongoose from "mongoose";

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
