import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
  phoneNumber: { type: String, required: true },
  otp: { type: String },
  otpExpiry: { type: Number },
});

export default mongoose.model("OtpCerification", otpSchema);
