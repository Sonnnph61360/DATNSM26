import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    userId: { type: Number, required: true, index: true },
    fieldId: { type: Number, required: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

favoriteSchema.index({ userId: 1, fieldId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
