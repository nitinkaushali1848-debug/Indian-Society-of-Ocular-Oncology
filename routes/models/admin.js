import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true }, // email or username
  passwordHash: { type: String, required: true },
  name: String,
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now }
});

// helper to set password
adminSchema.methods.setPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(plain, salt);
};

// validate password
adminSchema.methods.validatePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model("Admin", adminSchema);