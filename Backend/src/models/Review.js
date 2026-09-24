import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    fieldId: { type: Number, required: true, index: true },
    bookingId: { type: Number, sparse: true },
    userId: { type: Number, sparse: true, index: true },
    userName: { type: String, default: "Người chơi" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "", maxlength: 2000 },
    status: { type: String, enum: ["visible", "hidden"], default: "visible", index: true },
  },
  { timestamps: true, versionKey: false }
);

reviewSchema.index({ fieldId: 1, status: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);
