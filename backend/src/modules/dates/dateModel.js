import mongoose from "mongoose";
const DateModel = mongoose.Schema({
  userID: { type: String, require: true },
  date: { type: Date, require: true },
  name: { type: String, require: true },
  type: { type: String, default: "" },
  rule: { type: String, default: "" },
});

mongoose.model("MarkedDate", DateModel);

export default Date;
