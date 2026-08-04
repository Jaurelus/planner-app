import mongoose from "mongoose";
const ReminderSchema = mongoose.Schema({
  userID: { type: String, required: true },
  // Date, not String -- so range queries ($lte/$gte) work for the noti sweep
  date: { type: Date, required: true },
  description: { type: String, required: true },
  // Set when a push has gone out, so the sweep doesn't resend
  notifiedAt: { type: Date, default: null },
  // TTL index: Mongo deletes the doc once this passes
  expiresAt: {
    type: Date,
    index: { expires: 0 },
  },
});
const Reminder = mongoose.model("Reminder", ReminderSchema);
export default Reminder;
