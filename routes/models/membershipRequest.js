import mongoose from "mongoose";

const membershipRequestSchema = new mongoose.Schema({
  title: String,
  name: { type: String, required: true },
  email: String,
  phone: String,
  qualification: String,
  designation: String,
  institution: String,
  address: String,
  category: String,
  paymentMode: String,
  source: { type: String, enum: ["online", "offline"], default: "online" },
  files: {
    photoPath: String,
    certificatePath: String,
    paymentProofPath: String,
  },
  passwordHash: String, // hashed password provided at signup (we can create user from this)
  status: {
    type: String,
    enum: ["pending", "rejected", "approved"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MembershipRequest", membershipRequestSchema);
