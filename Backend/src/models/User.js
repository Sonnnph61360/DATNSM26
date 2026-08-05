import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
