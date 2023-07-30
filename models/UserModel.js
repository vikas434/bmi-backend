import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  phoneNumber: { type: String, required: true },
  isRegisterd: { type: Boolean, required: true, default: false },
});

export default mongoose.model("User", userSchema);
