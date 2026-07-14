import mongoose from "mongoose";
const ReminderSchema = mongoose.Schema({
  userID: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
});
const Reminder = mongoose.model("Reminder", ReminderSchema);
export default Reminder;
