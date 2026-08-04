import mongoose, { Schema } from "mongoose";

const UserModel = new mongoose.Schema({
  email: { type: String, required: true },
  phoneNumber: { type: String },
  password: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  pushToken: { type: String },

  //userMarkedDates
});

const User = mongoose.model("User", UserModel);

export default User;
