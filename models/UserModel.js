import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  phoneNumber: { type: String, required: true },
  otp: { type: Number },
  optExpiry: { type: Number },
  isRegisterd: { type: Boolean, required: true },
});

export default mongoose.model("user", userSchema);
