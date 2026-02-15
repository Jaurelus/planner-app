import mongoose, { Schema } from "mongoose";

const UserModel = new mongoose.Schema({
  email: { type: String, required: true },
  phoneNumber: { type: String },
  password: { type: String, required: true },
  firstName: { type: String, required: true, default: "" },
  lastName: { type: String, default: "" },

  isVerified: { type: Boolean, default: false },
  verficationToken: { type: String },
  //userMarkedDates
});

const User = mongoose.model("User", UserModel);

export default User;
