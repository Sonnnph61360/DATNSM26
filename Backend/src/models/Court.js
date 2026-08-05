import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    fieldId: { type: Number, required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, default: "Basketball" },
    price: { type: Number, required: true, default: 0 },
    status: { type: String, default: "active" },
    capacity: { type: Number, default: 4 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Court", courtSchema);
