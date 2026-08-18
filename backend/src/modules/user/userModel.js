import mongoose, { Schema } from "mongoose";

const UserModel = new mongoose.Schema({
  // unique -> Mongo rejects a second account on the same address.
  // lowercase/trim so "Jay@x.com" and "jay@x.com " can't both exist.
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phoneNumber: { type: String },
  password: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  pushToken: { type: String },
  notificationsEnabled: { type: Boolean, default: true },

  //userMarkedDates
});

const User = mongoose.model("User", UserModel);

export default User;
